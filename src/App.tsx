
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import RegisterFormFacade from './components/Register/RegisterFormFacade';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterFormFacade />} />
      </Routes>
    </>
  );
}

export default App;
