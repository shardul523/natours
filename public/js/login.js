/* eslint-disable */
const form = document.querySelector(".form");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passInput.value;

  axios
    .post("/api/v1/users/login", { email, password })
    .then((res) => {
      if (res.data.status === "success") location.replace("/");
    })
    .catch((err) => console.error(err.response));
});
