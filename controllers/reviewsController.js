const { Review } = require("../models");
// const { catchAsync } = require("../utils");
const factory = require("./handlersfactory");

exports.setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createNewReview = factory.createOne(Review);

exports.getAllReviews = factory.getAll(Review);

exports.updateReviewById = factory.updateOne(Review);

exports.deleteReviewById = factory.deleteOne(Review);

exports.getReviewById = factory.createOne(Review);
