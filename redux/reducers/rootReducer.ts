import { combineReducers } from 'redux';
import authReducer from './authReducer'; // Đảm bảo rằng bạn đã xuất khẩu authReducer đúng cách

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;