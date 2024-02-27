const router = require("express").Router();

const controllers = require("../controllers");

router.get("/", controllers.views.getToursOverview);

router.get("/tour/:slug", controllers.views.getTour);

module.exports = router;
