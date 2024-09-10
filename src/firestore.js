import { initializeApp } from "firebase/app";
import { getDocs, getFirestore } from "firebase/firestore";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";

// Initialize Cloud Firestore
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud firestore and get a reference to the service
const db = getFirestore(app);
const docIds = [
  "LEJTpEMzmy4rmIOOuHGK",
  "T914JYcadubcNjPCfcwG"
]

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

//getWorkOrder("LEJTpEMzmy4rmIOOuHGK");


// from an array of workOrder ids, query each id, adding each doc to an array and return
export const getWorkOrders = async (workOrderIds) => {
  const workOrders = [];

  for (const id of workOrderIds) {
    const workOrder = await getWorkOrder(id);
    if (workOrder)
      workOrders.push(workOrder);
  }

  return workOrders;
}



//console.log(JSON.stringify(getWorkOrders(docIds), null, 2));

// (async () => {
//   const workOrders = await getWorkOrders(docIds);
//   console.log(JSON.stringify(workOrders, null, 2));
// })();