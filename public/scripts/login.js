import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    // console.log('signup fn');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
      password,
    });
    if (res.data.status === 'success') {
      showAlert('login_success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/profile');
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert('login_failure', err.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    // console.log('got into login function');
    if (res.data.status === 'success') {
      showAlert('login_success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/profile');
      }, 1500);
    }
  } catch (err) {
    // console.log(err);
    showAlert('login_failure', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.assign('/login');
  } catch (err) {
    // console.log(err.response);
    showAlert('error', 'Error logging out..');
  }
};
