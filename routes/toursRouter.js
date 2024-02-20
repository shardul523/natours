const express = require("express");

const controllers = require("../controllers");

const router = express.Router();

router
  .route("/get-monthly-plans/:year")
  .get(controllers.tours.getMonthlyPlansByYear);

router.route("/get-tours-stat").get(controllers.tours.getToursStat);

router
  .route("/top-tours")
  .get(controllers.tours.aliasTopTours, controllers.tours.getAllTours);

router
  .route("/")
  .get(controllers.tours.getAllTours)
  .post(controllers.tours.createNewTour);

router
  .route("/:id")
  .get(controllers.tours.getTourById)
  .patch(controllers.tours.updateTourById)
  .delete(controllers.tours.deleteTourById);

module.exports = router;
