const express = require("express");

const { signUp } = require("../controllers/authControllers");

const {
  getAllUsers,
  createNewUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/usersControllers");

const router = express.Router();

router.post("/signup", signUp);

router.route("/").get(getAllUsers).post(createNewUser);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
