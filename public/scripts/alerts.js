export const hideAlert = () => {
  const el = document.querySelector(".login__status");
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, mesg) => {
  hideAlert();
  // const markup = `<div class="alert alert--${type}">${mesg}</div>`;
  const alertmesg = `<div class="login__status">
    <h3 class="login_status-text ${type}">${mesg}</h3>
  </div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", alertmesg);
  window.setTimeout(hideAlert, 5000);
};
