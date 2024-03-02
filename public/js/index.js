/* eslint-disable */

import { showMap } from "./map";
import { login, logout } from "./login";

const mapbox = document.getElementById("map");
const loginForm = document.querySelector(".login-form");
const logoutBtn = document.querySelector(".nav__el--logout");

if (mapbox) showMap(mapbox);
if (loginForm) {
  const form = document.querySelector(".form");
  const emailInput = document.getElementById("email");
  const passInput = document.getElementById("password");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    login(emailInput.value, passInput.value);
  });
}

if (logoutBtn) logoutBtn.addEventListener("click", logout);
