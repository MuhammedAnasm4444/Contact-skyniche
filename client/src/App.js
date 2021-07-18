
import '@fortawesome/fontawesome-free/css/all.min.css'; import
'bootstrap-css-only/css/bootstrap.min.css'; import
'mdbreact/dist/css/mdb.css';
import Table from './components/Table'

function App() {
  return (
    <div className="App " >
      <div className="container">
      <div className="row">
<h1 className="mt-4">Contacts</h1>
      </div>
      </div>
     <hr/>
      <Table className="" />
     
    </div>
  );
}

export default App;
