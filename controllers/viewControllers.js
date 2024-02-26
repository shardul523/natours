const { Tour } = require("../models");
const { catchAsync } = require("../utils");

exports.getToursOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overview", { tours });
});
exports.getTour = (req, res) => res.status(200).render("tour");
