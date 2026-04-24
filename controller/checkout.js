
const Cart = require("../model/cartmodel");
const Order = require("../model/checkoutmodel");
const { clearAllProductCaches } = require("../middleware/cache");

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate(
      "products.productId"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Calculate total
    let total = 0;

    cart.products.forEach((item) => {
      total += item.productId.price * item.quantity;
    });

    // Create Order
    const order = new Order({
      userId,
      name,
      email,
      phone,
      address,
      products: cart.products,
      totalAmount: total,
      status: "PENDING",
    });

    await order.save();
    // Clear cart after checkout
    await Cart.findOneAndDelete({ userId });
    // Clear product caches so changes reflect immediately
    clearAllProductCaches();
    res.status(200).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { checkout };