const express = require("express");
const router = express.Router();

const register  = require("../controller/userregister");
const  login  = require("../controller/userlogin");
const { sendOtp } = require("../controller/sendotp");
const { verifyOtp } = require("../controller/verifyotp");
const authMiddleware = require("../middleware/authmiddleware");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, removeProductImage } = require("../controller/productcontroller");
const { addToCart, getCart, clearCart, removeFromCart } = require("../controller/cartcontroller");
const upload = require("../middleware/upload");
const { checkout } = require("../controller/checkout");
const adminlogin = require("../controller/adminlogin");

// Register Route
router.post("/userregister", register);

// Login Route
// Admin login is handled first; if not admin, it falls through to user login.
router.post("/login", adminlogin, login);


router.post("/sendotp", sendOtp);

router.post("/verifyotp",verifyOtp);
router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  createProduct
);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", deleteProduct);
router.delete("/deleteimage/:id",upload.single("image"), removeProductImage); // NOT deleteProduct
router.post("/cart", authMiddleware, addToCart);
router.get("/cart", getCart);
router.delete("/cart/:productId",removeFromCart);
router.delete("/cart", clearCart);

router.post("/checkout", authMiddleware, checkout);


module.exports = router;
