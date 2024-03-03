/* eslint-disable */

import { showMap } from "./map";
import { login, logout, updateUserDetails } from "./api";

const mapbox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const updateUserForm = document.querySelector(".form-user-data");

if (mapbox) showMap(mapbox);
if (loginForm) {
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(emailInput.value, passInput.value);
  });
}

if (logoutBtn) logoutBtn.addEventListener("click", logout);

console.log(updateUserForm);
if (updateUserForm) {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");

  updateUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateUserDetails({
      name: nameField.value,
      email: emailField.value,
    });
  });
}
