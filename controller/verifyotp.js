const User = require("../model/authmodel");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();
    const { clearAllProductCaches } = require("../middleware/cache");
    clearAllProductCaches();
    res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

module.exports = { verifyOtp };