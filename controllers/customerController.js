const Customer = require('../models/Customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
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
    const email = String(req.body.email || '').toLowerCase().trim();
    if (!email) {
      res.status(400);
      throw new Error('Customer email zaroori hai');
    }
    const existing = await Customer.findOne({ email });
    if (existing) {
      const updated = await Customer.findByIdAndUpdate(
        existing._id,
        { ...req.body, email },
        { new: true, runValidators: true }
      );
      return res.status(200).json(updated);
    }
    const customer = await Customer.create({ ...req.body, email });
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
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
