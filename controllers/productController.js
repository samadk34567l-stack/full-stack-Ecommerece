const Product = require('../models/Product');
const { isDbConnected } = require('../config/db');
const store = require('../config/memoryStore');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, dressStyle, minPrice, maxPrice, search, isNewArrival, isTopSelling } = req.query;

    if (!isDbConnected()) {
      let list = [...store.products];
      if (category) list = list.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
      if (dressStyle) list = list.filter((p) => p.dressStyle.toLowerCase() === String(dressStyle).toLowerCase());
      if (isNewArrival === 'true') list = list.filter((p) => p.isNewArrival);
      if (isTopSelling === 'true') list = list.filter((p) => p.isTopSelling);
      if (search) list = list.filter((p) => p.name.toLowerCase().includes(String(search).toLowerCase()));
      if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));
      return res.json(list);
    }

    let filter = {};
    if (category) filter.category = category;
    if (dressStyle) filter.dressStyle = dressStyle;
    if (isNewArrival === 'true') filter.isNewArrival = true;
    if (isTopSelling === 'true') filter.isTopSelling = true;
    if (search) {
      const safeSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safeSearch, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const product = store.products.find((p) => String(p._id) === String(req.params.id));
      if (!product) {
        res.status(404);
        throw new Error('Product nahi mila');
      }
      return res.json(product);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product nahi mila');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const newProd = {
        ...req.body,
        _id: `66b002${String(Date.now()).slice(-18).padStart(18, '0')}`,
        reviews: [],
        createdAt: new Date().toISOString(),
      };
      store.products.unshift(newProd);
      return res.status(201).json(newProd);
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const idx = store.products.findIndex((p) => String(p._id) === String(req.params.id));
      if (idx === -1) {
        res.status(404);
        throw new Error('Product nahi mila');
      }
      store.products[idx] = { ...store.products[idx], ...req.body };
      return res.json(store.products[idx]);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404);
      throw new Error('Product nahi mila');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      store.products = store.products.filter((p) => String(p._id) !== String(req.params.id));
      return res.json({ message: 'Product successfully delete ho gaya' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product nahi mila');
    }
    res.json({ message: 'Product successfully delete ho gaya' });
  } catch (error) {
    next(error);
  }
};

exports.addProductReview = async (req, res, next) => {
  try {
    const { name, rating, comment } = req.body;

    if (!isDbConnected()) {
      const product = store.products.find((p) => String(p._id) === String(req.params.id));
      if (!product) {
        res.status(404);
        throw new Error('Product nahi mila');
      }
      const review = {
        _id: `rev${Date.now()}`,
        name,
        rating: Number(rating),
        comment,
        verified: true,
        createdAt: new Date().toISOString(),
      };
      product.reviews.push(review);
      product.reviewsCount = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      return res.status(201).json({ message: 'Review add ho gaya', product });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product nahi mila');
    }

    const review = { name, rating: Number(rating), comment, verified: true };
    product.reviews.push(review);
    product.reviewsCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review add ho gaya', product });
  } catch (error) {
    next(error);
  }
};
