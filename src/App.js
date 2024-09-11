import './App.css';
import { getWorkOrders, getProperties } from './firestore';
import print from 'print-js'

const docIds = [
  "LEJTpEMzmy4rmIOOuHGK",
  "T914JYcadubcNjPCfcwG"
];


const printDocs = async () => {
  const workOrders = await getWorkOrders(docIds);
  getProperties(workOrders);
  const properties = [
    { field: 'name', displayName: 'Customer'},
    { field: 'number', displayName: 'Phone'}
  ];

  print({
    printable: workOrders, 
    properties: properties,
    type: 'json', 
    header: '<h1>Lumber Orders</h1>',
    repeatTableHeader: true
  });
}
function App() {
  return (
    <div className="App"> 
      <header className="App-header">
        <p>
        <button 
        type="button" 
        onClick={() => printDocs()}>
          Print JSON Data
        </button>
        </p>

      </header>
    </div>
  );
}

export default App;
