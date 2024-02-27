const { Tour } = require("../models");
const { catchAsync } = require("../utils");

exports.getToursOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overview", { tours });
});

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug }).populate({
    path: "reviews",
    fields: "rating review user",
  });

  res.status(200).render("tour", { tour });
});
