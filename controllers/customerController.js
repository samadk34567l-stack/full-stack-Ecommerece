const Customer = require('../models/Customer');
const { isDbConnected } = require('../config/db');
const store = require('../config/memoryStore');

exports.getCustomers = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.customers);
    }
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const customer = store.customers.find((c) => String(c._id) === String(req.params.id));
      if (!customer) {
        res.status(404);
        throw new Error('Customer nahi mila');
      }
      return res.json(customer);
    }
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404);
      throw new Error('Customer nahi mila');
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const customer = {
        ...req.body,
        _id: `66d003${String(Date.now()).slice(-18).padStart(18, '0')}`,
        totalOrders: 0,
        totalSpent: 0,
        status: req.body.status || 'Active',
        createdAt: new Date().toISOString(),
      };
      store.customers.unshift(customer);
      return res.status(201).json(customer);
    }
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = store.customers.findIndex((c) => String(c._id) === String(req.params.id));
      if (idx === -1) {
        res.status(404);
        throw new Error('Customer nahi mila');
      }
      store.customers[idx] = { ...store.customers[idx], ...req.body };
      return res.json(store.customers[idx]);
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer) {
      res.status(404);
      throw new Error('Customer nahi mila');
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      store.customers = store.customers.filter((c) => String(c._id) !== String(req.params.id));
      return res.json({ message: 'Customer delete ho gaya' });
    }
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.status(404);
      throw new Error('Customer nahi mila');
    }
    res.json({ message: 'Customer delete ho gaya' });
  } catch (error) {
    next(error);
  }
};
