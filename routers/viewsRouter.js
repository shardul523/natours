const router = require("express").Router();

const controllers = require("../controllers");

router.get("/", controllers.views.getToursOverview);

router.get("/tour", controllers.views.getTour);

module.exports = router;
