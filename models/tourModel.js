const mongoose = require("mongoose");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "The Tour must have a name"],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "A Tour must have a specified duration"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour must have a specified difficulty"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour must have a maximum group size"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour must have a price"],
    },
    discountedPrice: Number,
    summary: {
      type: String,
      required: [true, "A Tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A Tour must have a cover image"],
    },
    images: [String],
    startDates: [Date],
  },
  { timestamps: true },
);

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
