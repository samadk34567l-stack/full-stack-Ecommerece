const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isDbConnected } = require('../config/db');
const store = require('../config/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res, next) => {
  try {
    const { name, password, phone, role } = req.body;
    const email = String(req.body.email || '').toLowerCase().trim();
    const userRole = role === 'user' ? 'user' : 'admin';

    if (!isDbConnected()) {
      const exists = store.users.find((u) => u.email.toLowerCase() === email);
      if (exists) {
        res.status(400);
        throw new Error('Ye email pehle se registered hai');
      }
      const newUser = {
        _id: `66a001${String(Date.now()).slice(-18).padStart(18, '0')}`,
        name,
        email,
        password,
        role: userRole,
        phone: phone || '',
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
      store.users.unshift(newUser);
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('Ye email pehle se registered hai');
    }
    const user = await User.create({ name, email, password, role: userRole, phone });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email aur password dono likhna zaroori hai');
    }

    const cleanEmail = String(email).toLowerCase().trim();

    if (!isDbConnected()) {
      const user = store.users.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      );
      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
      res.status(401);
      throw new Error('Galat email ya password');
    }

    const user = await User.findOne({ email: cleanEmail });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Galat email ya password');
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json(req.user);
    }
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      throw new Error('User nahi mila');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.users.map(({ password, ...u }) => u));
    }
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
