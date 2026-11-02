const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const User = require('../models/User');

const DEFAULT_DELIVERY_FEE = 15;
const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ''));
const round2 = (n) => Math.round(n * 100) / 100;

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order nahi mila');
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      discountAmount,
      deliveryFee,
      paymentMethod,
      status,
    } = req.body;

    const isAdmin = !!(req.user && req.user.role === 'admin');

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error('Order mein kam az kam ek item hona chahiye');
    }

    const itemIds = items.map((item) =>
      [item.productId, item._id, item.id].find(isMongoId)
    );
    const uniqueIds = [...new Set(itemIds.filter(Boolean).map(String))];
    const itemNames = [
      ...new Set(items.map((item) => item.name).filter(Boolean)),
    ];
    const dbProducts =
      uniqueIds.length || itemNames.length
        ? await Product.find({
            $or: [
              ...(uniqueIds.length ? [{ _id: { $in: uniqueIds } }] : []),
              ...(itemNames.length ? [{ name: { $in: itemNames } }] : []),
            ],
          })
        : [];
    const productById = {};
    const productByName = {};
    dbProducts.forEach((prod) => {
      productById[String(prod._id)] = prod;
      if (prod.name) productByName[prod.name.toLowerCase()] = prod;
    });

    const cleanItems = items.map((item, index) => {
      const quantity = Math.min(100, Math.max(1, Math.floor(Number(item.quantity || item.qty)) || 1));
      const id = itemIds[index];
      const product =
        (id ? productById[String(id)] : null) ||
        (item.name ? productByName[String(item.name).toLowerCase()] : null);

      if (product) {
        if (product.inStock === false) {
          res.status(400);
          throw new Error(`"${product.name}" abhi stock mein nahi hai`);
        }
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          selectedColor: item.selectedColor || item.color || '',
          selectedSize: item.selectedSize || item.size || '',
          image: product.image || item.image || '',
        };
      }
      const customPrice = Number(item.price);
      if (item.name && Number.isFinite(customPrice) && customPrice >= 0) {
        return {
          name: item.name,
          price: customPrice,
          quantity,
          selectedColor: item.selectedColor || item.color || '',
          selectedSize: item.selectedSize || item.size || '',
          image: item.image || '',
        };
      }

      res.status(400);
      throw new Error(`Item #${index + 1} ka product database mein nahi mila`);
    });

    const subtotal = round2(
      cleanItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    const finalDiscount = round2(
      Math.min(subtotal, Math.max(0, Number(discountAmount) || 0))
    );
    const finalDelivery =
      isAdmin && deliveryFee !== undefined && Number.isFinite(Number(deliveryFee))
        ? Math.max(0, Number(deliveryFee))
        : DEFAULT_DELIVERY_FEE;

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: cleanItems,
      subtotal,
      discountAmount: finalDiscount,
      deliveryFee: finalDelivery,
      totalAmount: round2(subtotal - finalDiscount + finalDelivery),
      paymentMethod,
      status: isAdmin && status ? status : 'Pending',
    });
    if (order.customerEmail) {
      const normalizedEmail = String(order.customerEmail).toLowerCase().trim();
      await Customer.findOneAndUpdate(
        { email: normalizedEmail },
        {
          $inc: { totalOrders: 1, totalSpent: order.totalAmount },
          $set: {
            name: order.customerName,
            ...(order.customerPhone ? { phone: order.customerPhone } : {}),
            ...(order.shippingAddress
              ? { location: order.shippingAddress, address: order.shippingAddress }
              : {}),
          },
          $setOnInsert: {
            email: normalizedEmail,
            status: 'Active',
            ...(!order.customerPhone ? { phone: 'N/A' } : {}),
            ...(!order.shippingAddress ? { location: 'N/A', address: 'N/A' } : {}),
          },
        },
        { upsert: true, new: true }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      res.status(404);
      throw new Error('Order nahi mila');
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order nahi mila');
    }
    res.json({ message: 'Order delete ho gaya' });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find({ status: { $ne: 'Cancelled' } }).sort({ createdAt: -1 });
    const totalEarnings = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

    res.json({
      totalOrders,
      totalCustomers,
      totalProducts,
      totalUsers,
      totalEarnings,
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};
