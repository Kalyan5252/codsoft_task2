import axios from 'axios';
import { showAlert } from './alerts';

export const createTask = async (data) => {
  try {
    const url = '/api/v1/tasks/';
    const res = await axios({
      method: 'POST',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('login_success', 'New Task Updated');
      location.reload(true);
    }
  } catch (error) {
    showAlert('login_failure', err.response.data.message);
  }
};

export const updateProfile = async (data) => {
  try {
    // if (
    //   [data.name, data.mobile, data.department, data.skills, data.photo].every(
    //     (el) => !el
    //   )
    // ) {
    //   console.log(data);
    //   return showAlert('login_failure', 'No changes found');
    // }
    // console.log(data);
    const url = '/api/v1/users/updateUserData';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('login_success', 'Profile updated Successfully');
      location.reload(true);
    }
  } catch (error) {
    showAlert('login_failure', err.response.data.message);
  }
};

export const submitTask = async (id) => {
  try {
    const url = `/api/v1/tasks/${id}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        status: 'Completed',
      },
    });
    if (res.data.status === 'success') {
      showAlert('login_success', 'Task updated Successfully');
      location.reload(true);
    }
  } catch (err) {
    showAlert('login_failure', 'Cannot Submit Task');
  }
};
export const submitProject = async (id) => {
  try {
    const url = `/api/v1/projects/${id}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        status: 'Completed',
      },
    });
    if (res.data.status === 'success') {
      showAlert('login_success', 'Project updated Successfully');
      location.reload(true);
    }
  } catch (err) {
    showAlert('login_failure', 'Cannot Submit Project');
  }
};
