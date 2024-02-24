const crypto = require("crypto"); // less costly than crypto; for simple encryption
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name!"],
      minlength: [2, "A name nust be longer than a single character!"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email!"],
      unique: [true, "User's email must be unique!"],
      validate: [validator.isEmail, "Please enter a valid email!"],
    },
    photo: String,
    password: {
      type: String,
      required: [true, "A user must have a password!"],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password!"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Passwords do not match!",
      },
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin", "guide", "lead-guide"],
      default: "user",
    },
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.passwordCheck = async function (candidatePass, hashedPass) {
  const isCorrect = await bcrypt.compare(candidatePass, hashedPass);
  return isCorrect;
};

userSchema.methods.passwordTokenInSync = function (issuedTime) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt < issuedTime * 1000;
  }

  return true;
};

userSchema.methods.generatePassResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.updatePassword = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.passwordResetToken = undefined;
  this.passwordResetExpiresIn = undefined;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);

  // PREVENTING THE CONFIRM PASSWORD FIELD FROM BEING STORED
  this.confirmPassword = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") && !this.isNew)
    this.passwordChangedAt = Date.now() - 10000;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

module.exports = mongoose.model("User", userSchema);
