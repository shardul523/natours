const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers");

router.use(controller.auth.isAuthenticated);

router
  .route("/")
  .post(
    controller.auth.isAuthorized("user"),
    controller.reviews.setTourAndUserIds,
    controller.reviews.createNewReview,
  )
  .get(controller.auth.isAuthorized("user"), controller.reviews.getAllReviews);

router
  .route("/:id")
  .patch(controller.reviews.updateReviewById)
  .delete(controller.reviews.deleteReviewById);

module.exports = router;
