import { initializeApp } from "firebase/app";

import {
  getFirestore,
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  where,
  query,
  getDoc
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAG7aYqGunCEEqMePnR7YN_uMsn8yvwtcM",
  authDomain: "reverr-25fb3.firebaseapp.com",
  databaseURL: "https://reverr-25fb3-default-rtdb.firebaseio.com",
  projectId: "reverr-25fb3",
  storageBucket: "reverr-25fb3.appspot.com",
  messagingSenderId: "710745964607",
  appId: "1:710745964607:web:9c0b08192f30bb97bab88a",
  measurementId: "G-7S7P5C52RG"
};

const app = initializeApp(firebaseConfig);

// Firestore
const database = getFirestore();

// get single user
export const getSingleUserFromDatabase = async (id) =>{
  try{
    const result = await getDoc(doc(database, 'Users', id))
    console.log(result);
    return result.data();
  }catch (err){
    console.log(err)
    return -1;
  }
}

// update mentor account
export const updateMentorAccount = async (accountDetails, userEmail)=>{
  try{
    const result = await updateDoc(doc(database, "Users", userEmail), {accountDetails})
    return result;
  } catch (err){
    console.log(err)
    return -1;
  }
}

// update mentor calendly
export const updateMentorCalendly = async (mentorCalendlyLink, userEmail)=>{
  try{
    const result = await updateDoc(doc(database, "Users", userEmail), {mentorCalendlyLink})
    return result;
  } catch (err){
    console.log(err)
    return -1;
  }
}

// Fetch Admins Data
export const getAdminsFromDatabase = async () => {
  try {
    let Admins = [];
    await (
      await getDocs(collection(database, `Admin`))
    ).forEach((doc) => {
      Admins.push({ ...doc.data() });
    });
    return Admins
    // return [{email:"adminblogs@reverrapp.com", password:"admin@blogs"}];
  } catch (err) {
    console.log("Err: ", err);
  }
};

// getUser
export const getUserFromDatabase = async (uid) => {
  let User;
  await (
    await getDocs(
      query(collection(database, `Users`), where("uid", "==", `${uid}`))
    )
  ).forEach((doc) => {
    User = { ...doc.data() };
  });
  return User;
};


// updateUser

export const updateUserInDatabse = async (uid, data) => {
  try {
    return await updateDoc(doc(database, "Users", uid), data);
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
  
  if(media!==""){
  try {
    await uploadBytesResumable(ref(storage, `${path}/${media.name}`), media);
    const getMedia = await ref(storage, `${path}/${media.name}`);
    const mediaLink = await getDownloadURL(getMedia);
    return mediaLink;
  } catch (err) {
    console.log("Err: ", err);
  }
}
};

export const deleteMedia = (media, path) => {
  deleteObject(ref(storage, `${path}/${media}`));
};

//FETCH ARRAY OF UNIQUE ID FROM FIREBASE
export const getListOfUniqueId=async()=>{
try {
  let listOfUniqueId
  await (
    await getDocs(collection(database, `metaData`))
  ).forEach((doc) => {
  console.log(doc.id)
  if(doc.id==="applyForDeals"){
    listOfUniqueId=( doc.data().uniqueId);
  }
    
  });
  return listOfUniqueId;
} catch (error) {
  console.log("Err: ", error);
}
}

//ADD FORM UNIQUE ID
export const addUniqueIdToFirebase=async(id)=>{
  try {
    return await updateDoc(doc(database, "metaData", "applyForDeals"), {uniqueId:id});
  } catch (err) {
    console.log("Err: ", err);
  }
}

//ADD PPT DATA TO FIREBASE
export const addPptInDatabase=async(uid,data)=>{
  try {
    return await setDoc(doc(database, "PptTemplates", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
}

//ADD DOCUMENT IN FIREBASE
export const addDocumentInDatabase=async(uid,data)=>{
  try {
    return await setDoc(doc(database, "DocumentTemplates", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
}