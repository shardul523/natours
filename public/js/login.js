/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";
// const form = document.querySelector(".form");
// const emailInput = document.getElementById("email");
// const passInput = document.getElementById("password");

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const email = emailInput.value;
//   const password = passInput.value;

//   axios
//     .post("/api/v1/users/login", { email, password })
//     .then((res) => {
//       if (res.data.status === "success") location.replace("/");
//     })
//     .catch((err) => console.error(err.response));
// });

export function login(email, password) {
  axios
    .post("/api/v1/users/login", { email, password })
    .then((res) => {
      if (res.data.status === "success") {
        showAlert("success", "Logged in successfully!");
        setTimeout(() => location.replace("/"), 1000);
      }
    })
    .catch((err) => {
      const alert = showAlert("error", err.response.data.message);
      setTimeout(() => alert.remove(), 2000);
    });
}

export function logout() {
  axios
    .get("/api/v1/users/logout")
    .then(() => location.reload())
    .catch(() => console.error("There was an error logging out"));
}
