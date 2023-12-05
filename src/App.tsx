
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './pages/Register/Register';
import RegisterFormFacade from './pages/Register/RegisterFormFacade';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-1" element={<RegisterFormFacade />} />
      </Routes>
    </>
  );
}

export default App;
