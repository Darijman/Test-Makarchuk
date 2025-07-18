import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice/usersSlice';

const reducer = {
  usersSlice,
};

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
