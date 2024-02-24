const router = require("express").Router();

const controllers = require("../controllers");
const reviewRouter = require("./reviewsRouter");

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/monthly-plans/:year")
  .get(
    controllers.auth.isAuthenticated,
    controllers.auth.isAuthorized("admin", "guide", "lead-guide"),
    controllers.tours.getMonthlyPlansByYear,
  );

router.route("/tours-stat").get(controllers.tours.getToursStat);

router
  .route("/top-tours")
  .get(controllers.tours.aliasTopTours, controllers.tours.getAllTours);

router
  .route("/")
  .get(controllers.tours.getAllTours)
  .post(
    controllers.auth.isAuthenticated,
    controllers.auth.isAuthorized("admin", "lead-guide"),
    controllers.tours.createNewTour,
  );

router
  .route("/:id")
  .get(controllers.tours.getTourById)
  .patch(
    controllers.auth.isAuthenticated,
    controllers.auth.isAuthorized("admin", "lead-guide"),
    controllers.tours.updateTourById,
  )
  .delete(
    controllers.auth.isAuthenticated,
    controllers.auth.isAuthorized("admin", "lead-guide"),
    controllers.tours.deleteTourById,
  );

module.exports = router;
