import axios from 'axios';
import { lazySingleton } from './utils';

export const apiClient = lazySingleton(() =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
  })
);
