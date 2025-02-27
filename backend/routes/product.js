const express=require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct,deleteProduct } = require('../controller/productController');
const router=express.Router();
const {isAuthenticatedUser, authorizeRoles}=require('../middlewares/authenticate');

router.route('/products').get(isAuthenticatedUser,getProducts);

router.route('/product/:id').get(getSingleProduct);


//Admin routes
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'),newProduct);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteProduct);

module.exports=router; 