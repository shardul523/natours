const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "No review was provided!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A review must have a rating"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a user"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.static("calcRatingStats", async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRating,
  });
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// reviewSchema.pre(/^find/, function (next) {
//   this.select("-__v").populate([{ path: "user", select: "name photo" }]);
//   next();
// });

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // In case of review updation / deletion, we first need to get the document
  this.doc = await this.model.findOne(this.getQuery());
  next();
});

reviewSchema.post("save", function () {
  const Review = this.constructor;
  Review.calcRatingStats(this.tour);
});

reviewSchema.post(/^findOneAnd/, function () {
  this.doc.constructor.calcRatingStats(this.doc.tour);
});

module.exports = mongoose.model("Review", reviewSchema);
