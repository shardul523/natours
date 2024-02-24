const { Review } = require("../models");
const { catchAsync } = require("../utils");

exports.createNewReview = catchAsync(async (req, res) => {
  const { review, rating, tour, user } = req.body;

  const newReview = await Review.create({ review, rating, tour, user });

  res.status(201).json({
    status: "success",
    data: { review: newReview },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    data: { reviews },
  });
});
