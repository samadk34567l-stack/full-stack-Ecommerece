// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

const { users, products, customers, orders } = require('./data/seedData');
dotenv.config();
const importData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();
    await User.deleteMany();
    await User.create(users);
    const createdProducts = await Product.insertMany(products);
    await Customer.insertMany(customers);
    const productIdByName = {};
    createdProducts.forEach((p) => {
      productIdByName[p.name] = p._id;
    });

    const sampleOrders = orders.map((order) => {
      return {
        ...order,
        items: order.items.map((item) => ({
          ...item,
          productId: productIdByName[item.name],
        })),
      };
    });

    await Order.insertMany(sampleOrders);

    console.log('✅ Saara Initial Data MongoDB mein successfully daal diya gaya hai!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();
    await User.deleteMany();

    console.log('🗑️ Saara Data MongoDB se delete kar diya gaya hai!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
