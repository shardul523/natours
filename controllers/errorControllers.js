const { AppError } = require("../utils");

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleValidationErrorDB = (err) => {
  const errMsgs = Object.values(err.errors).join(". ");
  const message = `Invalid field values. ${errMsgs}`;

  return new AppError(message, 400);
};

const handleDuplicateNameErrorDB = () =>
  new AppError("Name already taken by another tour", 400);

const sendErrResDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });

const sendErrResProd = (err, res) => {
  if (err.isOperational)
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });

  res.status(500).json({ status: "error", message: "Internal Server Error!" });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // if (process.env.NODE_ENV === "development") return sendErrResDev(err, res);

  let error = { ...err };

  // HANDLING OPERATIONAL ERRORS

  // MONGOOSE ERROR
  if (err.name === "CastError") error = handleCastErrorDB(error);
  if (err.name === "ValidationError") error = handleValidationErrorDB(error);

  // MONGODB ERROR
  if (err.code === 11000) error = handleDuplicateNameErrorDB();

  if (process.env.NODE_ENV === "production") return sendErrResProd(error, res);

  return sendErrResDev(err, res);
};
