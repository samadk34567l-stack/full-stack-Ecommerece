const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, optionalAuth, admin } = require('../middlewares/authMiddleware');
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.route('/').get(protect, admin, getOrders).post(optionalAuth, createOrder);
router
  .route('/:id')
  .get(protect, admin, getOrderById)
  .put(protect, admin, updateOrder)
  .delete(protect, admin, deleteOrder);

module.exports = router;
