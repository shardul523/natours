const { User } = require("../models");
const { catchAsync, AppError } = require("../utils");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

exports.createNewUser = (req, res) => {
  res.send("New User created");
};

exports.getUserById = (req, res) => {
  res.send(`Received user with id ${req.params.id}`);
};

exports.updateUserById = (req, res) => {
  res.send(`Updated user with id ${req.params.id}`);
};

exports.deleteUserById = (req, res) => {
  res.send(`Deleted user with id ${req.params.id}`);
};

exports.updateDetails = catchAsync(async (req, res, next) => {
  // 1) Check if password is within the given fields
  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        "This route is not meant for password updation. Please try the /update-my-password route",
        400,
      ),
    );

  // 2) Update allowed fields
  const allowedFields = ["name", "photo"];

  allowedFields.forEach((field) => {
    if (req.body[field]) req.user[field] = req.body[field];
  });

  await req.user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

exports.deleteAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
