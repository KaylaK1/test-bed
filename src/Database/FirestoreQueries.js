import { doc, getDoc, updateDoc, increment, documentId, setDoc  } from "firebase/firestore";
import { db } from "./firestore";

export const getWorkOrders = async (workOrderIds) => {
    const workOrders = [];
  
    for (const id of workOrderIds) {
      try {
        const workOrder = await getWorkOrder(id);
        if (workOrder) {
          workOrders.push(workOrder);
      }
      } catch {
        console.error('Error retrieving work order');
      }
    }
       
    return workOrders;
}

const getWorkOrder = async (documentId) => {
  try {
    const docRef = doc(db, 'work_orders', documentId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.error('No such document!');
      return null;
    }
  } catch (e) {
    console.error('Error getting document: ', e);
    return null;
  }
}

export const updateLumberOrder = async (documentId, lumberItem) => {
  const docRef = doc(db, 'work_orders', documentId);
  
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentData = docSnap.data();
      const currentOrder = currentData.additionalLumberOrder || {};
      const currentTypeOrder = currentOrder[lumberItem.type] || {};
      let currentTotalValue = currentTypeOrder[lumberItem.length] || 0;

      let newTotal = currentTotalValue += 1;

      await setDoc(docRef, {
        "additionalLumberOrder": {
          [lumberItem.type]: {
            [lumberItem.length]: newTotal
          }
        }
      }, { merge: true });

    } else {
      console.error("No such document.");
      return null;
    }
  } catch(e) {
    console.error(e);
    return null;
  }
};