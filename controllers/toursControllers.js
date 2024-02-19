const Tour = require("../models/tourModel");
const { MongoAPIFeatures, catchAsync, AppError } = require("../utils");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "names,price,ratingsAverage,difficulty,summary";
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  const apiFeatures = new MongoAPIFeatures(Tour.find(), req.query)
    .filter()
    .paginate()
    .select()
    .sort();

  const tours = await apiFeatures.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
});

exports.createNewTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) return next(new AppError("No such tour was found!", 404));

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

exports.updateTourById = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) return next(new AppError("No such tour was found!", 404));

  res.status(200).json({
    status: true,
    data: { tour: updatedTour },
  });
});

exports.deleteTourById = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      message: "Deletion successful",
    },
  });
});

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
