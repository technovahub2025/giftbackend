const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/authmodel");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Optimized query with lean() for faster performance
    const user = await User.findOne({ email }).select('+password').lean();

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = login ;