const express = require("express");

const controllers = require("../controllers");

const router = express.Router();

router.post("/signup", controllers.auth.signUp);
router.post("/login", controllers.auth.login);

router.route("/forgot-password").post(controllers.auth.forgotPassword);
router.route("/reset-password/:token").patch(controllers.auth.resetPassword);

router.use(controllers.auth.isAuthenticated);

router.patch("/update-my-password", controllers.auth.updatePassword);
router.patch("/update-my-details", controllers.users.updateDetails);
router.delete("/delete-my-account", controllers.users.deleteAccount);

router.use(controllers.auth.isAuthorized("admin"));

router
  .route("/")
  .get(controllers.users.getAllUsers)
  .post(controllers.users.createNewUser);

router
  .route("/:id")
  .get(controllers.users.getUserById)
  .patch(controllers.users.updateUserById)
  .delete(controllers.users.deleteUserById);

module.exports = router;
