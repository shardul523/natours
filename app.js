const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { body } = require("express-validator");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const { AppError } = require("./utils");
const { error: globalErrorHandler } = require("./controllers");
const apiRouter = require("./routers");
const viewsRouter = require("./routers/viewsRouter");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

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
app.use(cookieParser());

app.use(hpp({ whitelist: ["ratingsAverage", "price"] }));
app.use([body("*").escape()]);

const scriptSrcUrls = ["https://unpkg.com/", "https://tile.openstreetmap.org"];
const styleSrcUrls = [
  "https://unpkg.com/",
  "https://tile.openstreetmap.org",
  "https://fonts.googleapis.com/",
];
const connectSrcUrls = ["https://unpkg.com", "https://tile.openstreetmap.org"];
const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", "https:"],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  }),
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/", viewsRouter);
app.use("/api", limiter);
app.use("/api/v1", apiRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot reach ${req.originalUrl} on the server!`, 404));
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
