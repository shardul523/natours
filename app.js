const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { body } = require("express-validator");
const mongoSanitize = require("express-mongo-sanitize");

const { AppError } = require("./utils");
const { error: globalErrorHandler } = require("./controllers");
const routers = require("./routers");

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(mongoSanitize());
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());

app.use(hpp({ whitelist: ["ratingsAverage", "price"] }));
app.use(body().escape());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api", limiter);
app.use("/api/v1/tours", routers.tours);
app.use("/api/v1/users", routers.users);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot reach ${req.originalUrl} on the server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
