const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { catchAsync } = require("../utils");

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;

exports.signUp = catchAsync(async (req, res) => {
  const { name, password, confirmPassword, email } = req.body;
  const newUser = await User.create({ name, password, confirmPassword, email });

  const token = jwt.sign({ id: newUser._id }, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: { user: newUser },
  });
});
