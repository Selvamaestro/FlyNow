import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

const couponRef = collection(db, "coupons");

// Get All Coupons
export const getCoupons = async () => {

  const snapshot = await getDocs(couponRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

};

// Add Coupon
export const addCoupon = async (coupon) => {

  return await addDoc(couponRef, coupon);

};

// Edit Coupon
export const editCoupon = async (id, data) => {

  return await updateDoc(
    doc(db, "coupons", id),
    data
  );

};

// Delete Coupon
export const deleteCoupon = async (id) => {

  return await deleteDoc(
    doc(db, "coupons", id)
  );

};