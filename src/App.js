import './App.css';
import { getWorkOrders } from './firestore';

const docIds = [
  "LEJTpEMzmy4rmIOOuHGK",
  "T914JYcadubcNjPCfcwG"
];

(async () => {
  const workOrders = await getWorkOrders(docIds);
  console.log(JSON.stringify(workOrders, null, 2));
})();

function App() {
  return (
    <div className="App"> 
      <header className="App-header">
        
        <p>
          
        </p>

      </header>
    </div>
  );
}

export default App;
