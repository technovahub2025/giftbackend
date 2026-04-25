const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/authmodel"); // 👈 FIXED

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password"); // 👈 FIXED

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userObj,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = login;