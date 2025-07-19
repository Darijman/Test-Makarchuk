import { User } from '@/interfaces/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsers, deleteUser, createUser, editUser } from './usersRequests';

interface UsersState {
  users: User[];
  isLoading: boolean;
  deletionError: string;
  usersError: string;
  currentPage: number;
  totalUsers: number;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  deletionError: '',
  usersError: '',
  currentPage: 1,
  totalUsers: 1,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearDeletionError(state) {
      state.deletionError = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.usersError = '';
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<{ users: User[]; totalUsers: number }>) => {
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;

        state.isLoading = false;
      })
      .addCase(getUsers.rejected, (state) => {
        state.usersError = 'Failed to load users. Try again later';
        state.isLoading = false;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.deletionError = 'Something went wrong.. Please try again later.';
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<void, string, { arg: number }>) => {
        const deletedUserId: number = action.meta.arg;
        state.users = state.users.filter((user) => user.id !== deletedUserId);
        state.totalUsers -= 1;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.unshift(action.payload);
        state.totalUsers += 1;
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user.id === updatedUser.id);

        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      });
  },
});

export const { clearDeletionError } = usersSlice.actions;
export default usersSlice.reducer;
