/* eslint-disable */

export function showAlert(type, text) {
  const alert = document.createElement("div");
  alert.classList.add("alert", `alert--${type}`);
  alert.innerText = text;
  document.querySelector("body").insertAdjacentElement("afterbegin", alert);
  return alert;
}

export function timedAlert(type, text, timeout) {
  const alert = showAlert(type, text);
  setTimeout(() => alert.remove(), timeout);
}
