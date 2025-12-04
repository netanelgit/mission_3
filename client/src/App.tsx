import { Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import AddOperation from './components/AddOperation/AddOperation';
import Operations from './components/Operations/Operations';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/add-operation/:accountId" element={<AddOperation />} />
      <Route path="/view-operations/:accountId" element={<Operations />} />
    </Routes>
  );
}

export default App;
