const router = require("express").Router();

const controllers = require("../controllers");

router.use(controllers.auth.isLoggedIn);

router.get("/me", controllers.views.getMe);

router.get("/", controllers.views.getToursOverview);

router.get("/tour/:slug", controllers.views.getTour);

router.get("/login", controllers.views.getLoginForm);

module.exports = router;
