const { Tour } = require("../models");
const { catchAsync } = require("../utils");
const factory = require("./handlersfactory");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "names,price,ratingsAverage,difficulty,summary";
  next();
};

exports.getAllTours = factory.getAll(Tour);

exports.createNewTour = factory.createOne(Tour);

exports.getTourById = factory.getOne(Tour, { path: "reviews" });

exports.updateTourById = factory.updateOne(Tour);

exports.deleteTourById = factory.deleteOne(Tour);

exports.getToursStat = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

exports.getMonthlyPlansByYear = catchAsync(async (req, res) => {
  const year = +req.params.year;
  const plans = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numToursStart: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $set: { month: "$_id" },
    },
    {
      $project: { _id: false },
    },
    {
      $sort: { numToursStart: -1 },
    },
  ]);

  res.status(200).json({ status: "succeed", data: { plans } });
});
