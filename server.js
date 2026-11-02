const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB().catch((err) => console.error('Initial DB connection failed:', err.message));

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Ensure MongoDB connection is established before handling any API route
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503);
    next(new Error(`Database connection failed: ${error.message}`));
  }
});

app.get('/', (req, res) => {
  res.send('E-Commerce & Admin Dashboard API Running Successfully!');
});

app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'E-Commerce & Admin Dashboard API is active',
    endpoints: ['/api/products', '/api/orders', '/api/customers', '/api/auth/login', '/api/auth/register'],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Also support direct routes without /api prefix in case VITE_API_URL omits /api
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server port ${PORT} par chal raha hai...`);
  });
}

module.exports = app;
