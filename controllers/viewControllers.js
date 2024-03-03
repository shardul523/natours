const { Tour } = require("../models");
const { catchAsync, AppError } = require("../utils");

exports.getToursOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  if (!tours) return next(new AppError("No Tours were found!", 404));

  res.status(200).render("overview", { tours });
});

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug }).populate({
    path: "reviews",
    fields: "rating review user",
  });

  res.status(200).render("tour", { tour, title: tour.name });
});

exports.getLoginForm = (req, res) =>
  res.status(200).render("login", { title: "Log in to your account" });

exports.getMe = catchAsync(async (req, res) =>
  res.status(200).render("account", { title: "About User" }),
);
