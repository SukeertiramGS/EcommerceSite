
const Order =require('../models/orderModel');

//create new order-api/v1/order/new

const catchAsyncError = require("../middlewares/catchAsyncError");

exports.newOrder=catchAsyncError(async (req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body;

    const order=await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user:req.user.id
    })

    res.status(200).json({
        success:true,
        order
    })


})