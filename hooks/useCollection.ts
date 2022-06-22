import { ICollection } from "@/interfaces/Collection";
import { initFirebase } from "@/libs/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const firebase = initFirebase();

export default function useCollection() {
  const getCollectionData = async (contract: string) => {
    if (!firebase) return null;

    const collectionDoc = doc(firebase.db, "collections", contract);
    const collection = await getDoc(collectionDoc);
    if (collection.exists()) {
      let data: ICollection = {
        contract: collection.data()?.contract,
        name: collection.data()?.name,
        id: collection.data()?.id,
        avatar: collection.data()?.avatar,
      };
      return data;
    }
    return null;
  };

  const getAllCollections = async () => {
    if (!firebase) return null;
    const snapshot = await getDocs(collection(firebase.db, "collections"));
    const docs = snapshot.docs;
    const collections = docs.map((collection) => {
      const data: ICollection = {
        contract: collection.data()?.contract,
        name: collection.data()?.name,
        id: collection.data()?.id,
        avatar: collection.data()?.avatar,
      };
      return data;
    });
    return collections;
  };

  const saveCollectionData = async (data: ICollection) => {
    if (!firebase) return;

    const collectionDoc = doc(firebase.db, "collections", data.contract);
    await setDoc(collectionDoc, data);
  };

  const isDuplicatedName = async (name: string) => {
    if (!firebase) return true;

    const q = query(
      collection(firebase.db, "collections"),
      where("name", "==", name)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    return docs.length > 0;
  };

  return { getCollectionData, saveCollectionData, getAllCollections, isDuplicatedName };
}
