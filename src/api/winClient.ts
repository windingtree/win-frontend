import axios from 'axios';
import { backend } from 'src/config';

export const winClient = axios.create({
  baseURL: backend.url,
  withCredentials: true
});
