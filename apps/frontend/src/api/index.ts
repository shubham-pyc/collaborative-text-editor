import axios from 'axios';
import { BASE_URL } from '../constants';
import { iLoginForm } from '../interfaces';

export async function callHello() {
  return await axios.get(`${BASE_URL}/hello`);
}

export async function register(formData: iLoginForm) {
  return await axios.post(`${BASE_URL}/register`, formData);
}
