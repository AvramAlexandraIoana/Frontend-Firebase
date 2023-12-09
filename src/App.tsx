import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer/rootReducer';
import RegisterFormFacade from './components/Register/RegisterFormFacade';
import LoginFormFacade from './components/Login/LoginFormFacade';
import { thunk } from 'redux-thunk';

// Create the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

function App() {
  return (
    // Wrap the entire app with the Provider and pass the Redux store
    <Provider store={store}>
      <>
        <Routes>
          <Route path="/" element={<LoginFormFacade />} />
          <Route path="/register" element={<RegisterFormFacade />} />
          <Route path="/login" element={<LoginFormFacade />} />
        </Routes>
      </>
    </Provider>
  );
}

export default App;
