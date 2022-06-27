import { useWeb3React } from "@web3-react/core";
import styles from "@/styles/WorkSpace.module.scss";
import ChatRoom from "./ChatRoom";
import useUser from "@/hooks/useUser";
import { useEffect } from "react";
import { useState } from "react";
import { IUser } from "@/interfaces/User";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import useCollection from "@/hooks/useCollection";
import { ICollection } from "@/interfaces/Collection";
import Web3 from "web3";
import { checkHoldNFT } from "@/libs/utils";

type ChatSpaceProps = {
  isRegisteringCollection: boolean;
  setIsRegisteringCollection: any;
};

const ChatSpace = ({
  isRegisteringCollection,
  setIsRegisteringCollection,
}: ChatSpaceProps) => {
  const { active, account, library } = useWeb3React();
  const { getUserData, saveUserData, uploadAvatar, isDuplicatedUserId } =
    useUser();
  const {
    saveCollectionData,
    getAllCollections,
    isDuplicatedName,
    isDuplicatedContract,
  } = useCollection();
  const [user, setUser] = useState<IUser>({
    id: "",
    userId: "",
    userName: "",
    userChatToken: "",
    userActivityToken: "",
    avatar: "",
  });
  const [isShownProfileModal, setIsShownProfileModal] =
    useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<any>("/images/avatar.png");
  const [avatarFile, setAvatarFile] = useState<any>("");
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [collectionName, setCollectionName] = useState<string>("");
  const [isWorking, setIsWorking] = useState<boolean>(false);

  const onUploadImageClicked = (event: any) => {
    var input = event.target;
    if (input.files) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        setAvatarPreview(e?.target.result);
      };
      setAvatarFile(input.files[0]);
      reader.readAsDataURL(input.files[0]);
    }
  };

  const saveProfile = async () => {
    if (isWorking) return;
    if (!(active && account && library)) return;

    if (!userName || !userId) {
      toast.error("Please type the exact name and id.");
      return;
    }

    setIsWorking(true);

    // Validation
    const duplicated = await isDuplicatedUserId(userId);
    if (duplicated) {
      toast.error("User ID is already used.");
      setIsWorking(false);
      return;
    }

    let avatar: string | undefined = "/images/avatar.png";
    if (avatarFile) {
      avatar = await uploadAvatar(avatarFile);
    }
    if (!avatar) {
      avatar = "/images/avatar.png";
    }

    // Call server side API to create user token
    const response = await fetch("/api/createtoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userName, avatar }),
    });

    if (response.ok) {
      const data = await response.json();
      const userChatToken = data?.userChatToken;
      const userActivityToken = data?.userActivityToken;

      const user: IUser = {
        id: account,
        avatar,
        userId,
        userName,
        userChatToken,
        userActivityToken,
      };
      setUser(user);
      await saveUserData(user);

      toast.success("Your profile is successfully created.");
    } else {
      if (response.status == 400) {
        const data = await response.json();
        const error = data?.error;
        toast.error(error);
      } else {
        toast.error("Error occured on creating token in server side.");
      }
    }
    setIsWorking(false);
    setIsShownProfileModal(false);

    setUserId("");
    setUserName("");
    setAvatarFile("");
    setAvatarPreview("/images/avatar.png");
  };

  const registerCollection = async () => {
    if (isWorking) return;
    if (!(active && account && library)) return;

    if (!contractAddress || !collectionName) {
      toast.error("Please type the exact values.");
      return;
    }

    setIsWorking(true);

    // Validation
    const duplicatedContract = await isDuplicatedContract(contractAddress);
    if (duplicatedContract) {
      toast.error("Contract is already taken.");
      setIsWorking(false);
      return;
    }

    const duplicatedName = await isDuplicatedName(collectionName);
    if (duplicatedName) {
      toast.error("Collection Name is already used.");
      setIsWorking(false);
      return;
    }

    const collectionId = collectionName.replaceAll(" ", "").toLowerCase();
    let avatar: string | undefined = "/images/avatar.png";
    if (avatarFile) {
      avatar = await uploadAvatar(avatarFile);
    }
    if (!avatar) {
      avatar = "/images/avatar.png";
    }

    if (!Web3.utils.isAddress(contractAddress)) {
      toast.error("Please type contract address correctly.");
      setIsWorking(false);
      return;
    }

    const holdNFT = await checkHoldNFT(account, contractAddress);
    if (!holdNFT) {
      toast.error("You need to have at least one NFT.");
      setIsWorking(false);
      return;
    }

    // Call server side API to create channel
    const response = await fetch("/api/createchannel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        contractAddress,
        collectionName,
        collectionId,
        avatar,
      }),
    });

    if (response.ok) {
      const collection: ICollection = {
        contract: contractAddress,
        name: collectionName,
        id: collectionId,
        avatar,
      };
      await saveCollectionData(collection);

      toast.success("Your collection is successfully registered.");
    } else {
      if (response.status == 400) {
        const data = await response.json();
        const error = data?.error;
        toast.error(error);
      } else {
        toast.error("Error occured on creating channel in server side.");
      }
    }
    setIsWorking(false);
    setIsRegisteringCollection(false);

    setContractAddress("");
    setCollectionName("");
    setAvatarFile("");
    setAvatarPreview("/images/avatar.png");
  };

  const updateMemebership = async (user: IUser) => {
    const collections = await getAllCollections();

    const response = await fetch("/api/updatemembership", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        address: account,
        collections,
      }),
    });

    if (!response.ok) {
      if (response.status == 400) {
        const data = await response.json();
        const error = data?.error;
        toast.error(error);
      } else {
        toast.error("Error occured on updating membership in server side.");
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!(active && account && library)) return;

      setIsWorking(true);

      const user = await getUserData(account);
      if (user) {
        setUser(user);

        // Update membership
        await updateMemebership(user);
      } else {
        setIsShownProfileModal(true);
      }

      setIsWorking(false);
    })();
  }, [active]);

  return (
    <div className={styles.container}>
      {active ? (
        !isShownProfileModal &&
        user.userChatToken && (
          <div className={styles.chatroomContainer}>
            <ChatRoom
              userToken={user.userChatToken}
              userId={user.userId}
              userName={user.userName}
              avatar={user.avatar}
            />
          </div>
        )
      ) : (
        <div className={styles.message}>Please connect the wallet.</div>
      )}

      <Modal
        open={isShownProfileModal}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            setIsShownProfileModal(false);
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          <div className={styles.avatarContainer}>
            <img className={styles.previewImage} src={avatarPreview} />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUploadImageClicked(e)}
              className={styles.inputImage}
            />
          </div>
          <br />
          <Input
            type="text"
            placeholder="User ID"
            value={userId}
            sx={{
              width: "100%",
              textAlign: "center",
            }}
            onChange={(e) => setUserId(e.target.value)}
          />
          <br />
          <Input
            type="text"
            placeholder="User Name"
            value={userName}
            sx={{
              width: "100%",
              textAlign: "center",
            }}
            onChange={(e) => setUserName(e.target.value)}
          />
          <br />
          <Button
            variant="contained"
            onClick={saveProfile}
            sx={{
              width: "100%",
            }}
          >
            Save
          </Button>
        </div>
      </Modal>

      <Modal
        open={isRegisteringCollection}
        onClose={() => setIsRegisteringCollection(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          <div className={styles.avatarContainer}>
            <img className={styles.previewImage} src={avatarPreview} />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => onUploadImageClicked(e)}
              className={styles.inputImage}
            />
          </div>
          <br />
          <Input
            type="text"
            placeholder="Contract Address"
            value={contractAddress}
            sx={{
              width: "100%",
              textAlign: "center",
            }}
            onChange={(e) => setContractAddress(e.target.value?.toLowerCase())}
          />
          <br />
          <Input
            type="text"
            placeholder="Collection Name"
            value={collectionName}
            sx={{
              width: "100%",
              textAlign: "center",
            }}
            onChange={(e) => setCollectionName(e.target.value)}
          />
          <br />
          <Button
            variant="contained"
            onClick={registerCollection}
            sx={{
              width: "100%",
            }}
          >
            Save
          </Button>
        </div>
      </Modal>

      {isWorking && <div className={styles.loading}></div>}
    </div>
  );
};

export default ChatSpace;
