const { users, products, customers, orders } = require('../data/seedData');

const makeHexId = (prefix, idx) =>
  `${prefix}${String(idx + 1).padStart(24 - prefix.length, '0')}`;

const store = {
  users: users.map((u, i) => ({
    ...u,
    _id: makeHexId('66a001', i),
    createdAt: new Date().toISOString(),
  })),
  products: products.map((p, i) => ({
    ...p,
    _id: makeHexId('66b002', i),
    reviews: (p.reviews || []).map((r, ri) => ({
      ...r,
      _id: makeHexId(`66c${i}`, ri),
      createdAt: new Date().toISOString(),
    })),
    createdAt: new Date().toISOString(),
  })),
  customers: customers.map((c, i) => ({
    ...c,
    _id: makeHexId('66d003', i),
    createdAt: new Date().toISOString(),
  })),
  orders: orders.map((o, i) => ({
    ...o,
    _id: makeHexId('66e004', i),
    createdAt: new Date().toISOString(),
  })),
};

module.exports = store;

