import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getDashboardStats = async () => {
  try {
    const docRef = doc(db, "dashboard", "stats");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};