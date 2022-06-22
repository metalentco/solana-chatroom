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
import { StreamChat } from "stream-chat";
import { GETSTREAM_API_KEY, GETSTREAM_API_SECRECT_KEY } from "@/libs/constants";

type WorkSpaceProps = {
  isRegisteringCollection: boolean;
  setIsRegisteringCollection: any;
};

const WorkSpace = ({
  isRegisteringCollection,
  setIsRegisteringCollection,
}: WorkSpaceProps) => {
  const { active, account, library } = useWeb3React();
  const { getUserData, saveUserData, uploadAvatar, isDuplicatedUserId } =
    useUser();
  const { saveCollectionData, getAllCollections, isDuplicatedName } =
    useCollection();
  const [user, setUser] = useState<IUser>({
    id: "",
    userId: "",
    userName: "",
    userToken: "",
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

    const response = await fetch("/api/createtoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      const userToken = data?.userToken;

      const user: IUser = {
        id: account,
        avatar,
        userId,
        userName,
        userToken,
      };
      setUser(user);
      await saveUserData(user);

      toast.success("Your profile is successfully created.");
    } else {
      const data = await response.json();
      const error = data?.error;
      toast.error(error);
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

    const duplicated = await isDuplicatedName(collectionName);
    if (duplicated) {
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
      const data = await response.json();
      const error = data?.error;
      toast.error(error);
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
      const data = await response.json();
      const error = data?.error;
      toast.error(error);
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
        user.userToken && (
          <div className={styles.chatroomContainer}>
            <ChatRoom
              userToken={user.userToken}
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
            onChange={(e) => setContractAddress(e.target.value)}
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

export default WorkSpace;
