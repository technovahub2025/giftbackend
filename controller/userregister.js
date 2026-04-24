const bcrypt = require("bcryptjs");
const User = require("../model/authmodel");

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optimized check existing user with lean()
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password with optimized salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save user with lean object
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user"
    });

    await user.save();
 
    // Return optimized user object
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

module.exports =  register ;