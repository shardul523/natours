const express = require("express");
const morgan = require("morgan");

const { AppError } = require("./utils");
const { error: globalErrorHandler } = require("./controllers");
const routers = require("./routers");

const app = express();

app.use(express.static("public"));
app.use(express.json());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/tours", routers.tours);
app.use("/api/v1/users", routers.users);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot reach ${req.originalUrl} on the server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
