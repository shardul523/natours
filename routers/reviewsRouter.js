const router = require("express").Router();
const controller = require("../controllers");

router
  .route("/")
  .post(controller.reviews.createNewReview)
  .get(controller.reviews.getAllReviews);

module.exports = router;
