import axios from 'axios';
import {
  LOGIN_USER,
  AUTH_USER,
  LOGOUT_USER,
  SAVE_IMAGE
} from "./types";

export async function loginUser(dataToSubmit) {
  const request = await axios.post('/api/user/login', dataToSubmit)
    .then(res => res.data );
  return {
    type: LOGIN_USER,
    payload: request
  }
}

export async function auth(dataToSubmit) {
  const request = await axios.get('/api/user/auth', dataToSubmit)
    .then(res => res.data );
  return {
    type: AUTH_USER,
    payload: request
  }
}

export async function logoutUser() {
  const request = await axios.get('/api/user/logout')
    .then(res => res.data);
  return {
    type: LOGOUT_USER,
    payload: request
  };
}

export async function saveImage(formData, config) {
  const request = await axios.post('/api/user/uploadImage', formData, config).then(res => res.data);
  return {
    type: SAVE_IMAGE,
    payload: request
  }
}