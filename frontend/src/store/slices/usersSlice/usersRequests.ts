import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../../axiosConfig';

interface GetUsersArgs {
  offset?: number;
  limit?: number;
}

export const getUsers = createAsyncThunk(
  'getUsers',
  async ({ offset, limit }: GetUsersArgs = {}) => {
    const res = await api.get('/users', {
      params: { offset, limit },
    });
    return res.data;
  }
);
