
const jwt = require("jsonwebtoken");
const { clearAllProductCaches } = require("../middleware/cache");

// ✅ Static admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@123";

const adminlogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // 🔍 Debugging - Check what you're receiving
    console.log("Received email:", JSON.stringify(email));
    console.log("Received password:", JSON.stringify(password));
    console.log("Expected email:", JSON.stringify(ADMIN_EMAIL));
    console.log("Expected password:", JSON.stringify(ADMIN_PASSWORD));
    console.log("Email match:", email === ADMIN_EMAIL);
    console.log("Password match:", password === ADMIN_PASSWORD);

    // If this isn't the admin email, let the normal user login handler run.
    if (email !== ADMIN_EMAIL) {
      clearAllProductCaches();
      return next();
    }

    // ✅ Check admin credentials
    if (password === ADMIN_PASSWORD) {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: "JWT secret not configured",
        });
      }

      const token = jwt.sign(
        {
          id: "admin-id",
          email: ADMIN_EMAIL,
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      clearAllProductCaches();
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    // ❌ Invalid admin credentials
    clearAllProductCaches();
    return res.status(401).json({
      success: false,
      message: "Invalid admin email or password",
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = adminlogin;
