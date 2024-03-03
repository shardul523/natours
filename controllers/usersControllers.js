const { User } = require("../models");
const { catchAsync, AppError } = require("../utils");
const factory = require("./handlersfactory");

exports.getAllUsers = factory.getAll(User);

exports.getUserById = factory.getOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Check if password is within the given fields
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        "This route is not meant for password updation. Please try the /update-my-password route",
        400,
      ),
    );

  // 2) Update allowed fields
  const allowedFields = ["name", "photo", "email"];

  allowedFields.forEach((field) => {
    if (req.body[field]) req.user[field] = req.body[field];
  });

  await req.user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Only for admin

exports.updateUserById = factory.updateOne(User);

exports.deleteUserById = factory.deleteOne(User);

exports.createNewUser = factory.createOne(User);
