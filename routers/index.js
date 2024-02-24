const router = require("express").Router();

const usersRouter = require("./usersRouter");
const toursRouter = require("./toursRouter");
const reviewsRouter = require("./reviewsRouter");

router.use("/users", usersRouter);
router.use("/tours", toursRouter);
router.use("/reviews", reviewsRouter);

module.exports = router;
