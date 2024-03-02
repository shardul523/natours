/* eslint-disable */

export function showAlert(type, text) {
  const alert = document.createElement("div");
  alert.classList.add("alert", `alert--${type}`);
  alert.innerText = text;
  return alert;
}
