import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dateSlice from './slices/dateRangeSlice';
import listingReducer from './slices/listingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    date: dateSlice,
    listing: listingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
