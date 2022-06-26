import { COINBASE, METAMASK, WALLETCONNECT } from "./connectors";

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
export const ALCHEMY_API_ETH_PROVIDER_URL =
  process.env.NEXT_PUBLIC_ALCHEMY_API_ETH_PROVIDER_URL;

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

export const ERC1155_CONTRACT_ADDRESS =
  "0x7Aaf239882a2C81EB5CbFAf878Bb45859a633B40";
export const ERC721A_CONTRACT_ADDRESS =
  "0xe9B3dd6d5791D9aF0351E7F1b7934f838Ee4b6f6";

export const TAG_PROVIDER = "PROVIDER";

export const WALLETS = [
  {
    title: "Metamask",
    connector: METAMASK,
    icon: "/images/icons/icon-metamask.png",
  },
  {
    title: "Coinbase",
    connector: COINBASE,
    icon: "/images/icons/icon-coinbase.png",
  },
  {
    title: "Wallet Connect",
    connector: WALLETCONNECT,
    icon: "/images/icons/icon-walletconnect.png",
  },
];

export const NETWORK_TYPES = [
  "",
  "Ethereum Mainnet",
  "",
  "Ropsten Test Network",
  "Rinkeby Test Network",
];

export const GETSTREAM_APP_ID = process.env.NEXT_PUBLIC_GETSTREAM_APP_ID!;
export const GETSTREAM_API_KEY = process.env.NEXT_PUBLIC_GETSTREAM_API_KEY!;
export const GETSTREAM_API_SECRECT_KEY =
  process.env.NEXT_PUBLIC_GETSTREAM_API_SECRECT_KEY!;
export const GETSTREAM_OWNER_ID = process.env.NEXT_PUBLIC_GETSTREAM_OWNER_ID!;
