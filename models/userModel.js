const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name!"],
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
  },
  { timestamps: true },
);

userSchema.methods.passwordCheck = async function (candidatePass, hashedPass) {
  const isCorrect = await bcrypt.compare(candidatePass, hashedPass);
  return isCorrect;
};

userSchema.methods.passwordTokenInSync = function (issuedTime) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt < issuedTime;
  }

  return true;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  // HASH THE PASSWORD
  this.password = await bcrypt.hash(this.password, 12);

  // PREVENTING THE CONFIRM PASSWORD FIELD FROM BEING STORED
  this.confirmPassword = undefined;

  next();
});

module.exports = mongoose.model("User", userSchema);
