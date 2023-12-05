
import './App.css';
import { Routes, Route } from 'react-router-dom';
import RegisterFormFacade from './components/Register/RegisterFormFacade';
import LoginFormFacade from './components/Login/LoginFormFacade';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginFormFacade />} />
        <Route path="/register" element={<RegisterFormFacade />} />
        <Route path="/login" element={<LoginFormFacade />} />
      </Routes>
    </>
  );
}

export default App;
