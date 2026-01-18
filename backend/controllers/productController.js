const Product = require('../models/Product');
const { processMultipleImages } = require('../utils/imageProcessor');

// @desc    Get all products with pagination, search, and filters
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'active' };

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Filter by rating
    if (req.query.minRating) {
      query.rating = { $gte: parseFloat(req.query.minRating) };
    }

    // Filter by seller
    if (req.query.seller) {
      query.seller = req.query.seller;
    }

    // Filter flash sale
    if (req.query.flashSale === 'true') {
      query.isFlashSale = true;
      query.flashSaleEnd = { $gt: new Date() };
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortField = req.query.sort;
      if (sortField === 'price_asc') sort = { price: 1 };
      else if (sortField === 'price_desc') sort = { price: -1 };
      else if (sortField === 'rating') sort = { rating: -1 };
      else if (sortField === 'newest') sort = { createdAt: -1 };
      else if (sortField === 'popular') sort = { sold: -1 };
    } else {
      sort = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name avatar')
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name avatar email');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Seller, Admin)
exports.createProduct = async (req, res, next) => {
  try {
    // Add seller to req.body
    req.body.seller = req.user.id;

    // Process images if uploaded
    if (req.files && req.files.length > 0) {
      const images = await processMultipleImages(req.files, {
        width: 1200,
        quality: 80,
        format: 'webp'
      });
      req.body.images = images;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller - own products, Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Make sure user is product owner or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this product'
      });
    }

    // Parse specifications if it's a JSON string
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        req.body.specifications = JSON.parse(req.body.specifications);
      } catch (e) {
        req.body.specifications = {};
      }
    }

    // Handle existing images
    let productImages = product.images || [];
    if (req.body.existingImages) {
      try {
        productImages = typeof req.body.existingImages === 'string' 
          ? JSON.parse(req.body.existingImages) 
          : req.body.existingImages;
      } catch (e) {
        productImages = [];
      }
      delete req.body.existingImages;
    }

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = await processMultipleImages(req.files, {
        width: 1200,
        quality: 80,
        format: 'webp'
      });
      productImages = [...productImages, ...newImages];
    }

    req.body.images = productImages;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller - own products, Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Make sure user is product owner or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products (top sellers, high rated, most viewed)
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = 20;
    
    // Top selling products (by sold count)
    const topSellers = await Product.find({ status: 'active' })
      .populate('category', 'name slug')
      .populate('seller', 'name avatar')
      .sort('-sold')
      .limit(15);
    
    // High rated products
    const topRated = await Product.find({ status: 'active', rating: { $gte: 4 } })
      .populate('category', 'name slug')
      .populate('seller', 'name avatar')
      .sort('-rating -numReviews')
      .limit(15);
    
    // Combine and remove duplicates
    const productMap = new Map();
    [...topSellers, ...topRated].forEach(product => {
      if (!productMap.has(product._id.toString())) {
        productMap.set(product._id.toString(), product);
      }
    });
    
    // Convert to array
    let products = Array.from(productMap.values());
    
    // If we still don't have 20, fetch additional active products
    if (products.length < limit) {
      const existingIds = products.map(p => p._id);
      const additional = await Product.find({ 
        status: 'active',
        _id: { $nin: existingIds }
      })
        .populate('category', 'name slug')
        .populate('seller', 'name avatar')
        .sort('-createdAt')
        .limit(limit - products.length);
      
      products = [...products, ...additional];
    }
    
    // Final limit to 20
    products = products.slice(0, limit);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
