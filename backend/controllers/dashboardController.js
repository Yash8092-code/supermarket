const Order = require('../models/Order');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get real-time dynamic dashboard summary for authenticated buyer
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [orders, wishlist, user, popularProducts] = await Promise.all([
      Order.find({ buyer: userId }).sort({ createdAt: -1 }).lean(),
      Wishlist.findOne({ user: userId }).lean(),
      User.findById(userId).populate('cart.product').lean(),
      Product.find({ isPopular: true, inStock: true }).limit(4).lean()
    ]);

    const totalOrders = orders.length;
    const lifetimeSpend = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const wishlistCount = wishlist && wishlist.products ? wishlist.products.length : 0;

    const cartItems = user && user.cart ? user.cart : [];
    const cartItemCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const cartSubtotal = cartItems.reduce(
      (sum, i) => sum + (i.product ? i.product.price * i.quantity : 0),
      0
    );
    const cartGst = Math.round(cartSubtotal * 0.05 * 100) / 100;
    const cartGrandTotal = Math.round((cartSubtotal + cartGst) * 100) / 100;

    const recentOrders = orders.slice(0, 3).map(o => ({
      id: o.invoiceNo,
      orderId: o._id,
      date: new Date(o.orderDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      itemCount: o.itemCount,
      grandTotal: o.grandTotal,
      status: o.status,
      paymentMethod: o.paymentMethod
    }));

    res.status(200).json({
      success: true,
      data: {
        buyer: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role
        },
        stats: {
          totalOrders,
          lifetimeSpend: Math.round(lifetimeSpend * 100) / 100,
          wishlistCount,
          cartItemCount,
          cartGrandTotal
        },
        recentOrders,
        popularProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
