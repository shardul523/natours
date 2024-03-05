const multer = require("multer");
const { User } = require("../models");
const { catchAsync, AppError } = require("../utils");
const factory = require("./handlersfactory");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/img/users"),
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) return cb(null, true);
  cb(new AppError("Not an image! Please upload a valid image.", 400), false);
};

const upload = multer({ storage, fileFilter });

exports.uploadUserPhoto = upload.single("photo");

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
  console.log(req.file);
  if (req.body.name) req.user.name = req.body.name;
  if (req.body.email) req.user.email = req.body.email;
  if (req.file) req.user.photo = req.file.filename;

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
