// rootReducer.ts
import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // other reducers...
});

export default rootReducer;
