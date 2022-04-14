const Order = require('../models/order')
const Stock = require('../models/stock')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const product = require('../models/product')

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    res.status(200).json({
        success: true,
        orderCount: orders.length,
        orders
    })
})

exports.getAllUserOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ "user._id": req.user._id })

    if (!orders) { return next(new ErrorHandler('Orders not found', 404)) }

    res.status(200).json({
        success: true,
        orderCount: orders.length,
        orders
    })
})

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) { return next(new ErrorHandler('Order not found', 404)) }

    res.status(200).json({
        success: true,
        order
    })
})

exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    const status = "Order Placed";

    const order_history = {
        status,
        date: new Date(Date.now()),
        description: "Order Placed",
        updated_by: req.user.first_name + " " + req.user.last_name
    }

    const { first_name, _id, last_name, email, contact_number } = req.user
    const order = await Order.create({ ...req.body, user: { first_name, _id, last_name, email, contact_number }, order_history, status })

    res.status(201).json({
        success: true,
        order
    })
})

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    let order = await Order.findById(req.params.id)
    if (!order) { return next(new ErrorHandler('Order not found', 404)) }

    const { status, description } = req.body;

    var order_history = order.order_history
    order_history.push({
        status,
        description,
        date: new Date(Date.now()),
        updated_by: req.user.first_name + " " + req.user.last_name
    })

    if (status === 'Cancelled') {
        const stocks = await Stock.find({ refID: req.params.id }).populate('product')
        // console.log(stocks) //* working

        for(var i = 0 ; i < stocks.length ; i++) {
            stocks[i].isSold = false
            stocks[i].isArchived = false

            stocks[i].product.stock += 1
            await stocks[i].product.save()
            await stocks[i].save()
        }
    }

    order = await Order.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date(Date.now()), order_history }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        order
    })
})

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) { return next(new ErrorHandler('Order not found', 404)) }

    await order.remove()

    res.status(200).json({
        success: true,
        message: 'Order is deleted successfully'
    })
})