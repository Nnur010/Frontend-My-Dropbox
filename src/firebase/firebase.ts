import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "null",
  authDomain: "null",
  projectId: "null",
  storageBucket: "null",
  messagingSenderId: "null",
  appId: "null"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const usersCollection = collection(db, "users");
const usernamesCollection = collection(db, "usernames");
const folderCollection = collection(db, "folders");

export const generatedId = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const idLength = 16;
  let id = "";
  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
};

export {
  auth,
  db,
  usersCollection,
  usernamesCollection,
  storage,
  folderCollection,
};

export async function createFolderFirestorage(folderName: string) {
  const userId = auth.currentUser?.uid;
  const folderId = generatedId();
  try {
    const ref = doc(folderCollection, userId);
    const folderRef = collection(ref, "folder");
    const folderDoc = doc(folderRef, folderId);
    await setDoc(
      folderDoc,
      {
        name: folderName,
        folderId: folderId,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Create folder error", error);
  }
}

export async function InFolderCreateFolder(
  folderId: string,
  folderName: string
) {
  const userId = auth.currentUser?.uid;
  const Id = generatedId();

  try {
    const folderRef = doc(folderCollection, userId, "folder", folderId);
    const addFolderRef = collection(folderRef, "newFolder");
    const addFolderDoc = doc(addFolderRef, Id);
    await setDoc(
      addFolderDoc,
      {
        name: folderName,
        folderId: Id,
      },
      { merge: true }
    );
  } catch (error) {
    console.error(error);
  }
}
