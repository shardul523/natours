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
      enum: ["easy", "medium", "difficult"],
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
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual("durationInWeeks").get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
