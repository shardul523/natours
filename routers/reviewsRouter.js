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
  .get(controller.reviews.getAllReviews);

router
  .route("/:id")
  .get(controller.reviews.getReviewById)
  .patch(
    controller.auth.isAuthorized("user", "admin"),
    controller.reviews.updateReviewById,
  )
  .delete(
    controller.auth.isAuthorized("user", "admin"),
    controller.reviews.deleteReviewById,
  );

module.exports = router;
