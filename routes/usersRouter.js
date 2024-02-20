const express = require("express");

const controllers = require("../controllers");

const router = express.Router();

router.post("/signup", controllers.auth.signUp);
router.post("/login", controllers.auth.login);

router.use(controllers.auth.isAuthorized);

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
