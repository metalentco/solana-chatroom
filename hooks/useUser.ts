import { IUser } from "@/interfaces/User";
import { initFirebase } from "@/libs/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const firebase = initFirebase();

export default function useUser() {

  const getUserData = async (uid: string) => {
    if (!firebase) return null;

    const userDoc = doc(firebase.db, "users", uid);
    const user = await getDoc(userDoc);
    if (user.exists()) {
      let data: IUser = {
        id: user.data()?.id,
        userId: user.data()?.userId,
        userName: user.data()?.userName,
        userChatToken: user.data()?.userChatToken,
        userActivityToken: user.data()?.userActivityToken,
        avatar: user.data()?.avatar,
      };
      return data;
    }
    return null;
  };

  const saveUserData = async (data: IUser) => {
    if (!firebase) return;

    const userDoc = doc(firebase.db, "users", data.id);
    await setDoc(userDoc, data);
  }

  const uploadAvatar = async (file: any) => {
    if (!firebase) return;

    const storageRef = ref(firebase.storage, file.name + new Date().getTime());
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  };

  const isDuplicatedUserId = async (userId: string) => {
    if (!firebase) return true;

    const q = query(
      collection(firebase.db, "users"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    return docs.length > 0;
  };
  
  return {getUserData, saveUserData, uploadAvatar, isDuplicatedUserId};
}