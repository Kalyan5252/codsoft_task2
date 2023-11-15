import { login, logout, signup } from './login';
import { createTask, updateProfile, submitTask, submitProject } from './addons';

const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.save .btn__save');
const logoutBtn = document.querySelector('.logout');
const projectSelect = document.querySelector('.projectSelect');
const createTaskBtn = document.querySelector('.create_btn');
const userCards = document.querySelectorAll('.usermng_card');
const signupForm = document.querySelector('.signup__form');
const tasklistCards = document.querySelectorAll('.tasklist__card');
const projectlistCards = document.querySelectorAll('.project__card');
const workSubmitBtn = document.querySelector('.user_fsubmit');
const projectSubmitBtn = document.querySelector('.user_psubmit');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('login form');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log('got into loginForm function');
    // console.log({ email, password });
    login(email, password);
  });
if (userDataForm) {
  userDataForm.addEventListener('click', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('mobile', document.getElementById('mobile').value);
    form.append('department', document.getElementById('depart').value);
    form.append('skills', document.getElementById('skills').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateProfile(form, 'data');
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    logout();
  });
}

if (projectSelect) {
  //   console.log('project select option');
  projectSelect.addEventListener('change', function (e) {
    // console.log(projectSelect.value);
    location.assign(`/projectmanagement/${projectSelect.value}`);
  });
}
if (createTaskBtn) {
  createTaskBtn.addEventListener('click', function (e) {
    const projectMenu = document.querySelector('.project_menu');
    projectMenu.style.width = 'calc(100% - (240px + 10rem))';
    const createTaskForm = document.querySelector('.new_task_data');
    const submit_btn = document.querySelector('.submit_btn');
    submit_btn.addEventListener('click', function (e) {
      //   console.log('got submit');
      const name = document.getElementById('task').value;
      const department = document.getElementById('department').value;
      const user = document.getElementById('user').value;
      const date = document.getElementById('date').value;
      const description = document.getElementById('desc').value;
      const project = projectSelect.value;
      //   form.append('user', document.getElementById('user').value);
      //   form.append('department', document.getElementById('department').value);
      //   form.append('date', document.getElementById('date').value);
      //   form.append('description', document.getElementById('desc').value);
      createTask({ name, user, department, date, description, project });
    });
  });
}

if (userCards) {
  userCards.forEach((el) => {
    el.addEventListener('click', function (e) {
      //   console.log(el.dataset.userId);
      location.assign(`/userManagement/${el.dataset.userId}`);
    });
  });
}

if (signupForm) {
  console.log('signup form');
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    console.log({ name, email, password, confirmPassword });
    signup(name, email, password, confirmPassword);
  });
}

if (tasklistCards) {
  //   console.log('cards available');
  tasklistCards.forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.dataset.taskId) location.assign(`/tasks/${el.dataset.taskId}`);
      else location.assign(`/tasks/${el.dataset.projectId}`);
    });
  });
}
if (projectlistCards) {
  //   console.log('cards available');
  projectlistCards.forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.dataset.taskId) location.assign(`/tasks/${el.dataset.projectId}`);
      else location.assign(`/tasks/${el.dataset.projectId}`);
    });
  });
}

if (workSubmitBtn) {
  workSubmitBtn.addEventListener('click', function (e) {
    // console.log('workSubmit Button');
    const taskId = e.target.dataset.taskId;
    submitTask(taskId);
  });
}

if (projectSubmitBtn) {
  projectSubmitBtn.addEventListener('click', function (e) {
    console.log;
    const projectId = e.target.dataset.projectId;
    submitProject(projectId);
  });
}
