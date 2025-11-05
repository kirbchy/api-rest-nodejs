import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';
import { config } from '../config/index.js';

const jar = new CookieJar();
export const http = wrapper(axios.create({
  baseURL: config.spring.baseURL,
  withCredentials: true,
  jar
}));

// Helper para manejar errores uniformemente
export function mapError(error) {
  if (error.response) {
    const { status, data } = error.response;
    return { status, message: data?.message || data || 'Error en Spring API' };
  }
  return { status: 500, message: error.message || 'Error de red' };
}
