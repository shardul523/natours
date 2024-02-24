const { Review } = require("../models");
const { catchAsync } = require("../utils");
const { deleteOne } = require("./handlersfactory");

exports.createNewReview = catchAsync(async (req, res) => {
  const { review, rating } = req.body;
  let { tour, user } = req.body;

  if (!tour) tour = req.params.tourId;
  if (!user) user = req.user.id;

  const newReview = await Review.create({ review, rating, tour, user });

  res.status(201).json({
    status: "success",
    data: { review: newReview },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const filter = {};

  if (req.params.tourId) filter.tour = req.params.tourId;

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    data: { reviews },
  });
});

exports.deleteReviewById = deleteOne(Review);
