
import rootReducer from './rootReducer';
import { configureStore } from '@reduxjs/toolkit';

import { thunk } from 'redux-thunk';

// Create the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;
