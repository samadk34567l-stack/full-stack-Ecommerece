const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const store = require('../config/memoryStore');

const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const findUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!isDbConnected()) {
      return (
        store.users.find((u) => String(u._id) === String(decoded.id)) ||
        store.users[0]
      );
    }
    return await User.findById(decoded.id).select('-password');
  } catch (error) {
    return null;
  }
};

const protect = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Koi token nahi mila, authorization fail' });
  }

  const user = await findUserFromToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Token galat ya expire ho chuka hai' });
  }

  req.user = user;
  next();
};

const optionalAuth = async (req, res, next) => {
  const token = getToken(req);
  if (token) {
    const user = await findUserFromToken(token);
    if (user) req.user = user;
  }
  next();
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Ye kaam sirf admin kar sakta hai' });
};

module.exports = { protect, optionalAuth, admin };
