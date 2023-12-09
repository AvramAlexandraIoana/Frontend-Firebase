// rootReducer.ts
import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Assuming you have an authReducer

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here if you have them
});

export default rootReducer;

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;
