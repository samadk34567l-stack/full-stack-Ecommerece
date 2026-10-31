const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const store = require('../config/memoryStore');

const DEFAULT_DELIVERY_FEE = 15;
const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(String(value || ''));
const round2 = (n) => Math.round(n * 100) / 100;

exports.getOrders = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.orders);
    }
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const order = store.orders.find((o) => String(o._id) === String(req.params.id));
      if (!order) {
        res.status(404);
        throw new Error('Order nahi mila');
      }
      return res.json(order);
    }
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

    if (!isDbConnected()) {
      const cleanItems = items.map((item) => ({
        productId: item.productId || item._id || item.id,
        name: item.name || 'Product',
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity || item.qty) || 1),
        selectedColor: item.selectedColor || item.color || '',
        selectedSize: item.selectedSize || item.size || '',
        image: item.image || '',
      }));
      const subtotal = round2(cleanItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
      const finalDiscount = round2(Math.min(subtotal, Math.max(0, Number(discountAmount) || 0)));
      const finalDelivery =
        deliveryFee !== undefined && Number.isFinite(Number(deliveryFee))
          ? Math.max(0, Number(deliveryFee))
          : DEFAULT_DELIVERY_FEE;
      const newOrder = {
        _id: `66e004${String(Date.now()).slice(-18).padStart(18, '0')}`,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        shippingAddress: shippingAddress || '',
        items: cleanItems,
        subtotal,
        discountAmount: finalDiscount,
        deliveryFee: finalDelivery,
        totalAmount: round2(subtotal - finalDiscount + finalDelivery),
        paymentMethod: paymentMethod || 'Cash on Delivery',
        status: isAdmin && status ? status : 'Pending',
        createdAt: new Date().toISOString(),
      };
      store.orders.unshift(newOrder);
      return res.status(201).json(newOrder);
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
      await Customer.findOneAndUpdate(
        { email: order.customerEmail },
        {
          $inc: { totalOrders: 1, totalSpent: order.totalAmount },
          $setOnInsert: {
            name: order.customerName,
            phone: order.customerPhone || 'N/A',
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
    if (!isDbConnected()) {
      const idx = store.orders.findIndex((o) => String(o._id) === String(req.params.id));
      if (idx === -1) {
        res.status(404);
        throw new Error('Order nahi mila');
      }
      store.orders[idx] = { ...store.orders[idx], ...req.body };
      return res.json(store.orders[idx]);
    }
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
    if (!isDbConnected()) {
      store.orders = store.orders.filter((o) => String(o._id) !== String(req.params.id));
      return res.json({ message: 'Order delete ho gaya' });
    }
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
    if (!isDbConnected()) {
      const activeOrders = store.orders.filter((o) => o.status !== 'Cancelled');
      const totalEarnings = activeOrders.reduce((sum, ord) => sum + (Number(ord.totalAmount) || 0), 0);
      return res.json({
        totalOrders: store.orders.length,
        totalCustomers: store.customers.length,
        totalProducts: store.products.length,
        totalUsers: store.users.length,
        totalEarnings,
        recentOrders: store.orders.slice(0, 5),
      });
    }
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
