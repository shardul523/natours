const router = require("express").Router();

const controllers = require("../controllers");

router.post("/signup", controllers.auth.signUp);
router.post("/login", controllers.auth.login);
router.get("/logout", controllers.auth.logout);
router.post("/forgot-password", controllers.auth.forgotPassword);
router.patch("/reset-password/:token", controllers.auth.resetPassword);

router.use(controllers.auth.isAuthenticated);

router.patch("/update-my-password", controllers.auth.updatePassword);

router
  .route("/me")
  .get(controllers.users.getMe, controllers.users.getUserById)
  .patch(controllers.users.uploadUserPhoto, controllers.users.updateMe)
  .delete(controllers.users.deleteMe);

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
