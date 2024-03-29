import { firestore } from "../../persistence/firebase.config.js";
import {
  addDoc,
  getDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
  collection,
} from "@firebase/firestore";

const entriesRef = collection(firestore, "entries");

const addEntry = async (
  firstName,
  lastName,
  phone,
  rawContent,
  summary,
  remedies
) => {
  let data = {
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    rawContent: rawContent,
    summary: summary,
    remedies: remedies,
  };

  try {
    await addDoc(entriesRef, data);
  } catch (e) {
    console.log("Unable to add recent entry.", e);
  }
};

const getEntries = async () => {
  try {
    const getSnapshot = await getDocs(entriesRef);

    let entries = [];
    getSnapshot.forEach((doc) => {
      let data = {};
      data[doc.id] = doc.data();
      entries.push(data);
    });

    return entries;
  } catch (e) {
    console.log("Unable to get recent entries.", e);
  }
};

// getFirstEntry if below function does not return the elm too

const getAndRemoveFirstEntry = async () => {
  try {
    const getSnapshot = await getDocs(entriesRef);

    if (!getSnapshot.empty) {
      //We know there is one doc in the querySnapshot
      const queryDocumentSnapshot = getSnapshot.docs[0];
      return queryDocumentSnapshot.ref.delete();
    } else {
      console.log("No document corresponding to the query!");
      return null;
    }
  } catch (e) {
    console.log("Unable to get next entry.", e);
  }
};

const removeEntryById = async (id) => {
  try {
    await deleteDoc(doc(firestore, "entries", id));
  } catch (e) {
    console.log("Unable to delete entry.", e);
  }
};

export { addEntry, getEntries, removeEntryById, getAndRemoveFirstEntry };
