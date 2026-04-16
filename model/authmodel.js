const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,

      
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,

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

module.exports = mongoose.model("auth", UserSchema);
