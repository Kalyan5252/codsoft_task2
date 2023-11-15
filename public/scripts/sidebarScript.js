const sidebar = document.querySelector('.sidebar');
const menubtn = document.querySelector('.bx-menu');
const cardContainer = document.getElementById('card-container');
window.addEventListener('resize', () => {
  if (window.innerWidth < 743) sidebar.classList.add('close');
  else sidebar.classList.remove('close');
});
menubtn.addEventListener('click', () => {
  sidebar.classList.toggle('close');
});
