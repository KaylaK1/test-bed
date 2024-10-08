
import { getWorkOrders } from './Database/FirestoreQueries';
import { PrintingForm, reducer, initialState } from './Components/PrintingForm';
import { useEffect, useReducer, useState } from 'react';
import AdditionalLumberOrderDisplay from './Components/AdditionalLumberOrderDisplay'
//import AdditionalLumberOrderDisplay from './Components/LumberOrderDisplay';
import { db } from './Database/firestore';
import { onSnapshot, doc } from 'firebase/firestore';
const docIds = [
  "LEJTpEMzmy4rmIOOuHGK",
  "T914JYcadubcNjPCfcwG"
];

  
function App() {
  // Printing Orders: For setting and fetching work orderIds and associated fetchWorkOrders
  const [state, dispatch] = useReducer(reducer, initialState);

  // Printing Orders: State to track selected document ids to eliminate page rerenders and multiple queries
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  const [LumberOrder, setLumberOrder] = useState([]);
  const [additionalLumberOrder, setAdditionalLumberOrder] = useState([]);
  // Printing Orders: Handles checkbox selection. Updates local state. 
  // useCallback prevents rerenders when users selects checkboxes
  const handleCheckboxChange = (docId) => {
    setSelectedDocIds(prevSelected => 
      prevSelected.includes(docId)
        ? prevSelected.filter(id => id !== docId) // Remove if already selected
        : [...prevSelected, docId] // Add if not already selected
    );
  };
  
  // Printing Orders: When the download button is clicked. Dispatches local state
  // docIds to reducer, which will trigger a query from a useEffect hook. (which is watching the reducer)
  const handleDownloadClick = () => {
    dispatch({ type: 'SET_DOC_IDS', payload: selectedDocIds});
  }

  // Printing Orders: Query for the user selected orders, and update the reducer.
  // This only occurs when the reducer's state is updated via handleDownloadClick.
  useEffect(() => {

    const fetchWorkOrders = async () => {
      if (state.docIds.length > 0) {
      try {
        const fetchWorkOrders = await getWorkOrders(state.docIds);
        dispatch({ type: 'SET_WORK_ORDERS', payload: fetchWorkOrders });
      } catch (e) {
        console.error("Error querying for work orders: ", e);
      }
      }
    };

    fetchWorkOrders(); 
  }, [state.docIds]);

//   useEffect(() => {
//     if (!state.workOrders) {
//         return;
//     }
//     const unsubscribe = onSnapshot(doc(db, "work_orders", state.workOrder), (doc) => {
//       setAdditionalLumberOrder(doc.data().additionalLumberOrder)
//     });
//     console.log(additionalLumberOrder);
//     return () => unsubscribe()
// }, [state.workOrders])



  return (
    <div className="App"> 
      <header className="App-header">
         <AdditionalLumberOrderDisplay order={"T914JYcadubcNjPCfcwG"}/> 
       <PrintingForm workOrders={state.workOrders} additionalLumberOrder={additionalLumberOrder} />
       <div>
          <label>
            <input
              type="checkbox"
              value="LEJTpEMzmy4rmIOOuHGK"
              onChange={() => handleCheckboxChange('LEJTpEMzmy4rmIOOuHGK')}
            />
            Work Order 1
          </label>
          <label>
            <input
              type="checkbox"
              value="T914JYcadubcNjPCfcwG"
              onChange={() => handleCheckboxChange('T914JYcadubcNjPCfcwG')}
            />
            Work Order 2
          </label>
          {/* Add more checkboxes as needed */}
        </div>
        <button onClick={handleDownloadClick}>Download Selected Work Orders</button>
      </header>
    </div>
  );
}

export default App;