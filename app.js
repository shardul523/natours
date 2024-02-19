const express = require("express");
const morgan = require("morgan");

const { AppError } = require("./utils");
const globalErrorHandler = require("./controllers/errorControllers");
const toursRouter = require("./routes/toursRouter");
const usersRouter = require("./routes/usersRouter");

const app = express();

app.use(express.static("public"));
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot reach ${req.originalUrl} on the server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
