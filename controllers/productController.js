const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, dressStyle, minPrice, maxPrice, search, isNewArrival, isTopSelling } = req.query;

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
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
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
