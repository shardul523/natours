const express = require("express");

const controllers = require("../controllers");
const reviewRouter = require("./reviewsRouter");

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);
router.use(controllers.auth.isAuthenticated);

router
  .route("/monthly-plans/:year")
  .get(controllers.tours.getMonthlyPlansByYear);

router.route("/tours-stat").get(controllers.tours.getToursStat);

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
  .delete(
    controllers.auth.isAuthorized("admin"),
    controllers.tours.deleteTourById,
  );

module.exports = router;
