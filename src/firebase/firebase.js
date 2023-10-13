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
  getDoc,
} from "firebase/firestore";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  databaseURL: "https://dsquare-242c3-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyBe_7JYNBINJITC1HGbaLxgg3f7yZ0aud4",
  authDomain: "dsquare-242c3.firebaseapp.com",
  projectId: "dsquare-242c3",
  storageBucket: "dsquare-242c3.appspot.com",
  messagingSenderId: "103281255621",
  appId: "1:103281255621:web:c97b1cdbd53ad43ed1fcac",
  measurementId: "G-WS41LSXFKR",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const database = getFirestore();

// get single user
export const getSingleUserFromDatabase = async (id) => {
  try {
    const result = await getDoc(doc(database, "Users", id));
    console.log(result);
    return result.data();
  } catch (err) {
    console.log(err);
    return -1;
  }
};

//ADD MENTOR

export const addMentorInDatabase = async (uid, data) => {
  try {
    await setDoc(doc(database, "Users", uid), data);
    return true;
  } catch (err) {
    console.log("Err: ", err);
    return false;
  }
};

// update mentor account
export const updateMentorAccount = async (accountDetails, userEmail) => {
  try {
    const result = await updateDoc(doc(database, "Users", userEmail), {
      accountDetails,
    });
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

// update mentor calendly
export const updateMentorCalendly = async (mentorCalendlyLink, userEmail) => {
  try {
    const result = await updateDoc(doc(database, "Users", userEmail), {
      mentorCalendlyLink,
    });
    return result;
  } catch (err) {
    console.log(err);
    return -1;
  }
};

// get all mentors
export const getAllMentors = async () => {
  try {
    let users = [];
    let mentors = [];
    await (
      await getDocs(collection(database, "Users"))
    ).forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    users.map((user, idx) => {
      if (user.userType == "Mentor") {
        mentors.push({ ...user });
      }
    });
    return await mentors;
    // return [{email:"adminblogs@reverrapp.com", password:"admin@blogs"}];
  } catch (err) {
    console.log("Err: ", err);
    return -1;
  }
};

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
  if (media !== "") {
    try {
      await uploadBytesResumable(ref(storage, `${path}/${media.name}`), media);
      const getMedia = await ref(storage, `${path}/${media.name}`);
      const mediaLink = await getDownloadURL(getMedia);
      return mediaLink;
    } catch (err) {
      console.log("Err: ", err);
      return false;
    }
  }
};

export const deleteMedia = (media, path) => {
  deleteObject(ref(storage, `${path}/${media}`));
};

//FETCH ARRAY OF UNIQUE ID FROM FIREBASE
export const getListOfUniqueId = async () => {
  try {
    let listOfUniqueId;
    await (
      await getDocs(collection(database, `metaData`))
    ).forEach((doc) => {
      console.log(doc.id);
      if (doc.id === "applyForDeals") {
        listOfUniqueId = doc.data().uniqueId;
      }
    });
    return listOfUniqueId;
  } catch (error) {
    console.log("Err: ", error);
  }
};

//ADD FORM UNIQUE ID
export const addUniqueIdToFirebase = async (id) => {
  try {
    return await updateDoc(doc(database, "metaData", "applyForDeals"), {
      uniqueId: id,
    });
  } catch (err) {
    console.log("Err: ", err);
  }
};

//ADD PPT DATA TO FIREBASE
export const addPptInDatabase = async (uid, data) => {
  try {
    return await setDoc(doc(database, "PptTemplates", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const updateWebinarDatabase = async (data) => {
  try {
    return await updateDoc(doc(database, "meta", "webinar"), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

//ADD DOCUMENT IN FIREBASE
export const addDocumentInDatabase = async (uid, data) => {
  try {
    return await setDoc(doc(database, "DocumentTemplates", uid), data);
  } catch (err) {
    console.log("Err: ", err);
  }
};

//get whatsmessage
const whatsAppMessageCollectionRef = collection(database, "WhatsappMessages");
export const getMessage = async () => {
  try {
    const data = await getDocs(query(whatsAppMessageCollectionRef));
    const userdata = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return userdata;
  } catch (error) {
    console.error("Error retrieving message from Firestore:", error);
  }
};
