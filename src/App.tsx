import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider
import store from './redux/store'; // Import your Redux store
import RegisterFormFacade from './components/Register/RegisterFormFacade';
import LoginFormFacade from './components/Login/LoginFormFacade';

function App() {
  return (
    <Provider store={store}> {/* Wrap the entire component tree with Provider */}
      <>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<RegisterFormFacade />} />
          <Route path="/login" element={<LoginFormFacade />} />
        </Routes>
      </>
    </Provider>
  );
}

export default App;
