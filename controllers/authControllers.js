const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { catchAsync, AppError } = require("../utils");

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const signToken = async (id) =>
  await promisify(jwt.sign)({ id }, SECRET_KEY, { expiresIn: EXPIRES_IN });

const verifyToken = async (token) =>
  await promisify(jwt.verify)(token, SECRET_KEY);

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    email: req.body.email,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = await signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please enter email and password", 400));

  const user = await User.findOne({ email }).select("+password");

  const isValidAuth =
    user && (await user.passwordCheck(password, user.password));

  if (!isValidAuth) return next(new AppError("Invalid email or password", 401));

  const token = await signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  // 1) Get the token from header
  let token;

  if (
    req.header("Authorization") &&
    req.header("Authorization").startsWith("Bearer")
  )
    token = req.header("Authorization").replace("Bearer", "").trim();

  if (!token)
    return next(
      new AppError("You are not logged in! Please login to get access", 401),
    );

  // 2) Verify the token
  const { id, iat } = await verifyToken(token, SECRET_KEY);

  // 3) Check if user still exists
  const user = await User.findById(id);

  if (!user) {
    const message =
      "The user specified by the token no longer exists. Please login again!";
    return next(new AppError(message, 401));
  }

  // 4) Check if password has changed since the token was issued
  if (!user.passwordTokenInSync(iat))
    return next(new AppError("The password was changed, please login again!"));

  req.user = user;

  next();
});

exports.isAuthorized =
  (...roles) =>
  (req, _, next) => {
    if (roles.includes(req.user.role)) return next();

    next(new AppError(`You are not authorized to access this route`, 403));
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user for the specified email
  const { email } = req.body;

  if (!email) return next(new AppError("Please specify a valid email!", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("No user with this email exists", 400));

  const resetToken = user.generatePassResetToken();
  user.save({ validateModifiedOnly: true });

  res.send("Token generated");
});
