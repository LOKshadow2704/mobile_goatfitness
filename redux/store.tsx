import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer'; // Nhập reducer

const store = configureStore({
  reducer: {
    auth: authReducer, // Đặt reducer vào cấu trúc của store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
