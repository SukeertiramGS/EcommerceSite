const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// Get Products - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 3;
    
    let buildQuery = () => new APIFeatures(Product.find(), req.query).search().filter();
    
    const filteredProductsCount = await buildQuery().query.countDocuments();
    const totalProductsCount = await Product.countDocuments();
    let productsCount = filteredProductsCount !== totalProductsCount ? filteredProductsCount : totalProductsCount;
    
    const products = await buildQuery().paginate(resPerPage).query;

    res.status(200).json({
        success: true,
        count: productsCount,
        resPerPage,
        products
    });
});

// Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    let images = [];
    let BASE_URL = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

    if (req.files && req.files.length > 0) {
        images = req.files.map(file => ({ image: `${BASE_URL}/uploads/product/${file.originalname}` }));
    }

    req.body.images = images;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, product });
});

// Get Single Product - api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');
    if (!product) return next(new ErrorHandler('Product not found', 404));

    res.status(200).json({ success: true, product });
});

// Update Product - api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    let images = req.body.imagesCleared === 'false' ? product.images : [];
    let BASE_URL = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

    if (req.files && req.files.length > 0) {
        images = req.files.map(file => ({ image: `${BASE_URL}/uploads/product/${file.originalname}` }));
    }

    req.body.images = images;
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, product });
});

// Delete Product - api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product Deleted!' });
});

// Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler('Product not found', 404));

    const review = { user: req.user.id, rating, comment };
    const isReviewed = product.reviews.find(r => r.user?.toString() === req.user.id.toString());

    if (isReviewed) {
        product.reviews.forEach(r => {
            if (r.user?.toString() === req.user.id.toString()) {
                r.comment = comment;
                r.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.length > 0 
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length 
        : 0;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({ success: true });
});

// Get Reviews - api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Review - api/v1/review?productId= &id=
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const { productId, id } = req.query;
    if (!productId || !id) return res.status(400).json({ success: false, message: 'Product ID and Review ID are required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.reviews = product.reviews.filter(r => r._id.toString() !== id.toString());
    product.numOfReviews = product.reviews.length;
    product.ratings = product.numOfReviews > 0 
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numOfReviews 
        : 0;

    await Product.findByIdAndUpdate(productId, { reviews: product.reviews, numOfReviews: product.numOfReviews, ratings: product.ratings });
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
});

// Get Admin Products - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});
