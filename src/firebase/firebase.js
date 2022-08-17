import { initializeApp } from "firebase/app";

import {
  getFirestore,
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Firestore
const database = getFirestore();

// Fetch Admins Data
export const getAdminsFromDatabase = async () => {
  try {
    let Admins = [];
    await (
      await getDocs(collection(database, `Admin`))
    ).forEach((doc) => {
      Admins.push({ ...doc.data() });
    });
    return Admins;
  } catch (err) {
    console.log("Err: ", err);
  }
};

// getDocs
export const getInvestorDealsFromDatabase = async () => {
  try {
    let investorDeals = [];
    await (
      await getDocs(collection(database, `Investordeals`))
    ).forEach((doc) => {
      investorDeals.push({ ...doc.data() });
    });
    return investorDeals;
  } catch (err) {
    console.log("Err: ", err);
  }
};

// addDocs

export const addDealInDatabase = async (uid, data) => {
  try {
    return await setDoc(doc(database, "Investordeals", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

// updateDocs
export const updateInvestorDetailsInDatabase = async (uid, data) => {
  try {
    return await updateDoc(doc(database, "Investordeals", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

// deleteDocs

export const deleteInvestorDetailsInDatabse = async (uid) => {
  try {
    return await deleteDoc(doc(database, "Investordeals", uid));
  } catch (err) {
    console.log("Err: ", err);
  }
};

// Storage
const storage = getStorage(app);

export const uploadMedia = async (media, path) => {
  try {
    await uploadBytesResumable(ref(storage, `${path}/${media.name}`), media);
    const getMedia = await ref(storage, `${path}/${media.name}`);
    const mediaLink = await getDownloadURL(getMedia);
    return mediaLink;
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const deleteMedia = (media, path) => {
  deleteObject(ref(storage, `${path}/${media}`));
};
