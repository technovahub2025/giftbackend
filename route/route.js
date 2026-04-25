const express = require("express");
const router = express.Router();

const register  = require("../controller/userregister");
const  login  = require("../controller/userlogin");


const authMiddleware = require("../middleware/authmiddleware");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, removeProductImage } = require("../controller/productcontroller");
const { addToCart, getCart, clearCart, removeFromCart } = require("../controller/cartcontroller");
const upload = require("../middleware/upload");
const { checkout } = require("../controller/checkout");
const adminlogin = require("../controller/adminlogin");

// Route to clear all caches (for admin or development use)

const { validateUserRegistration, validateUserLogin, validateProductCreation, validateProductUpdate, validateProductId, validateProductQuery, validateCartAdd, validateOtpSend, validateOtpVerify } = require("../middleware/validation");

// Register Route
router.post("/userregister", validateUserRegistration, register);

// Login Route
// Admin login is handled first; if not admin, it falls through to user login.
router.post("/login", validateUserLogin, adminlogin);

router.post("/userlogin",validateUserLogin,login);


router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  validateProductCreation,
  createProduct
);
router.get("/products", validateProductQuery, getProducts);
router.get("/products/:id", validateProductId, getProductById);
router.put("/products/:id", authMiddleware, upload.single("image"), validateProductUpdate, updateProduct);
router.delete("/products/:id", authMiddleware, validateProductId, deleteProduct);
router.delete("/deleteimage/:id", authMiddleware, validateProductId, upload.single("image"), removeProductImage);
router.post("/cart", authMiddleware, validateCartAdd, addToCart);
router.get("/cart", authMiddleware, getCart);
router.delete("/cart/:productId", authMiddleware, validateProductId, removeFromCart);
router.delete("/cart", authMiddleware, clearCart);

router.post("/checkout", authMiddleware, checkout);


module.exports = router;
