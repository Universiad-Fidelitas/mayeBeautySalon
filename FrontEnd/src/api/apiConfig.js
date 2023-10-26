import axios from 'axios';

export const baseApi = axios.create({
  baseURL: 'http://localhost:4000/v1/api',
});