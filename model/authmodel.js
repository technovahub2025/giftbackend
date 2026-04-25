const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: false,
    },
  password: {
  type: String,
  required: true,
  select: false
},

      newpassword: {
      type: String,

    },

    confirmpassword: {
      type: String,

    },
   otp: String,
otpExpiry: Date,
isVerified: {
  type: Boolean,
  default: false
}

  },
  { timestamps: true }
);

// Compound index for faster queries
UserSchema.index({ email: 1, isVerified: 1 });

module.exports = mongoose.model("auth", UserSchema);
