import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "./firebase";

const categoryRef = collection(db, "categories");

export const getCategories = async () => {

  const snapshot = await getDocs(categoryRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

};

export const addCategory = async(category)=>{

  return await addDoc(categoryRef,category);

};

export const deleteCategory = async(id)=>{

  return await deleteDoc(doc(db,"categories",id));

};

export const editCategory = async(id,data)=>{

  return await updateDoc(
      doc(db,"categories",id),
      data
  );

};