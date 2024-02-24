const { catchAsync, AppError, MongoAPIFeatures } = require("../utils");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(200).json({
      status: "success",
      data: {
        message: "Deletion successful",
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc) return next(new AppError("No such tour was found!", 404));

    res.status(200).json({
      status: true,
      data: {
        data: updatedDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: newDoc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc)
      return next(
        new AppError("The document for given Id was not found!", 404),
      );

    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const filter = {};

    if (req.params.tourId) filter.tour = req.params.tourId;

    const apiFeatures = new MongoAPIFeatures(Model.find(filter), req.query)
      .filter()
      .paginate()
      .select()
      .sort();

    const docs = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: { data: docs },
    });
  });
