import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../axiosConfig';

interface GetUsersArgs {
  offset?: number;
  limit?: number;
}

export const getUsers = createAsyncThunk(`getUsers`, async ({ offset, limit }: GetUsersArgs = {}) => {
  const res = await api.get('/users', {
    params: { offset, limit },
  });
  return res.data;
});

export const deleteUser = createAsyncThunk(`deleteUser`, async (userId: number) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
});

export const createUser = createAsyncThunk(`createUser`, async (formData: FormData, { rejectWithValue }) => {
  try {
    const res = await api.post(`/users`, formData);
    return res.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue(error.message || 'Unknown error');
  }
});

export const editUser = createAsyncThunk('editUser', async ({ userId, formData }: { userId: number; formData: FormData }) => {
  const res = await api.put(`/users/${userId}`, formData);
  return res.data;
});
