import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
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
    }
  } catch (e) {
    console.error('Error getting document: ', e);
  }
}