import {combineReducers} from 'redux';
import common from './common_reducer';
import user from './user_reducer';
import admin from './admin_reducer';

const rootReducer = combineReducers({
  common,
  user,
  admin
});

export default rootReducer;