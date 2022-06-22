import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import {
  CHAIN_ID,
  GETSTREAM_API_KEY,
  NETWORK_TYPES,
  TAG_PROVIDER,
  WALLETS,
} from "@/libs/constants";
import { truncateAddress } from "@/libs/utils";
import styles from "@/styles/Header.module.scss";
import { StreamChat } from "stream-chat";

type HeaderProps = {
  onRegisterCollection: any;
};

const Header = ({ onRegisterCollection }: HeaderProps) => {
  const { active, account, chainId, library, activate, deactivate } =
    useWeb3React();
  const [isOpenConnectModal, setIsOpenConnectModal] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>(null);

  const connect = (wallet: any) => {
    window.localStorage.clear();
    window.localStorage.setItem(TAG_PROVIDER, wallet.title);
    setIsOpenConnectModal(false);
    setWallet(wallet);
    activate(wallet.connector);
  };

  const disconnect = () => {
    window.localStorage.clear();
    deactivate();

    // Disconnect chat stream
    try {
      const client = StreamChat.getInstance(GETSTREAM_API_KEY);
      client.disconnectUser(3000);
    } catch (e) {
      console.log(e);
    }
  };

  const copyAddress = () => {
    if (!account || !navigator) return;
    navigator.clipboard.writeText(account);
    toast.success("Copied to clipboard.");
  };

  useEffect(() => {
    const provider = window.localStorage.getItem(TAG_PROVIDER);
    if (provider) {
      for (let wallet of WALLETS) {
        if (provider == wallet.title) {
          connect(wallet);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!(active && account && library)) return;
    if (chainId != CHAIN_ID) {
      toast.info(`Please change network to ${NETWORK_TYPES[CHAIN_ID]}`);
      return;
    }
  }, [chainId]);

  return (
    <div className={styles.container}>
      {active ? (
        <>
          <div className={styles.wrapper}>
            <img className={styles.walletIcon} src={wallet?.icon} />
            <p className={styles.walletLabel} onClick={copyAddress}>
              {truncateAddress(account)}
            </p>
            <p className={styles.walletType}>
              (&nbsp;
              {chainId
                ? NETWORK_TYPES[chainId]
                  ? NETWORK_TYPES[chainId]
                  : "Unkown Network"
                : "Unkown Network"}
              &nbsp;)
            </p>
          </div>
          <button
            onClick={onRegisterCollection}
            className={styles.buttonConnect}
          >
            Register Collection
          </button>
          <button onClick={disconnect} className={styles.buttonConnect}>
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsOpenConnectModal(true)}
          className={styles.buttonConnect}
        >
          Connect Wallet
        </button>
      )}

      <Modal
        open={isOpenConnectModal}
        onClose={() => setIsOpenConnectModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          {WALLETS.map((wallet, index) => {
            return (
              <div
                className={styles.walletWrapper}
                key={index}
                onClick={() => connect(wallet)}
              >
                <img className={styles.walletIcon} src={wallet.icon} />
                <p className={styles.walletLabel}>{wallet.title}</p>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default Header;
