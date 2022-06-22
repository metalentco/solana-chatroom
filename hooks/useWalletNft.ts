import { useEffect, useState } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import {
  ALCHEMY_API_ETH_PROVIDER_URL,
  ALCHEMY_API_KEY,
  ERC1155_CONTRACT_ADDRESS,
} from "@/libs/constants";

export default function useWalletNft() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<Array<any>>([]);
  const { active, account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    (async () => {
      if (active && account) {
        setIsLoading(true);
        await getNfts(account, ERC1155_CONTRACT_ADDRESS);
        setIsLoading(false);
      }
    })();
  }, [active]);

  const getNfts = async (ownerAddress: string, contractAddress: string) => {
    try {
      const ethProvider = `${ALCHEMY_API_ETH_PROVIDER_URL}/${ALCHEMY_API_KEY}`;

      const web3 = createAlchemyWeb3(ethProvider);

      const nfts = await web3.alchemy.getNfts({
        owner: ownerAddress,
        contractAddresses: [contractAddress],
      });

      setNfts(nfts.ownedNfts);
    } catch (e) {
      console.log(e);
    }
  };

  return { isLoading, nfts, getNfts };
}
