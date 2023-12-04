
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './pages/Register/Register';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
