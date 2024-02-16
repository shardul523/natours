const Tour = require("../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "names,price,ratingsAverage,difficulty,summary";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILDING QUERY FOR FILTERING
    const excludedFields = ["sort", "limit", "page", "fields"];
    const filterObj = { ...req.query };

    excludedFields.forEach((field) => {
      delete filterObj[field];
    });

    // RELATIONAL FILTERING
    let filterStr = JSON.stringify(filterObj);
    filterStr = filterStr.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`,
    );

    let query = Tour.find(JSON.parse(filterStr));

    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.replaceAll(",", " ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Selecting the Fields Sent
    if (req.query.fields) {
      const fields = req.query.fields.replaceAll(",", " ");
      query = query.select(fields);
    } else {
      query = query.select("-__v -createdAt -updatedAt");
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;

    const numDocs = await Tour.countDocuments();

    if (numDocs <= skip) throw new Error("No such page");
    query = query.skip(skip).limit(limit);

    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createNewTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTourById = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: true,
      data: { tour: updatedTour },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        message: "Deletion successful",
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
