/* eslint-disable */

import { showMap } from "./map";
import { login, logout, updateUserDetails, updateUserPassword } from "./api";

const mapbox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const updateUserForm = document.querySelector(".form-user-data");
const passwordUpdateForm = document.querySelector(".form-user-settings");

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

console.log(passwordUpdateForm);
if (passwordUpdateForm) {
  const currentPassField = document.getElementById("password-current");
  const newPassField = document.getElementById("password");
  const confirmPassField = document.getElementById("password-confirm");

  passwordUpdateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await updateUserPassword({
      oldPassword: currentPassField.value,
      newPassword: newPassField.value,
      confirmNewPassword: confirmPassField.value,
    });
    passwordUpdateForm.reset();
  });
}
