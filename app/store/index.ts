import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dateRangeReducer from './slices/dateRangeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dateRange: dateRangeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
