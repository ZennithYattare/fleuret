const Order = require('../models/order')
const Stock = require('../models/stock')
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const product = require('../models/product')

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    const completeOrders = await Order.find({ status: 'Delivered' })
    const totalSales = completeOrders.reduce((acc, curr) => acc + Number(curr.total_price), 0)

    const weeklyDates = []
    const weeklyOrders = []

    for (let i = 0; i <= 5; i++) {
        weeklyDates.push(new Date(Date.now() - ((i * 7) * 24 * 60 * 60 * 1000)).setHours(0, 0, 0, 0))
    }
    for (let i = 0; i < weeklyDates.length - 1; i++) {
        console.log(new Date(weeklyDates[i]))
        const weeklyOrder = await Order.find({
            created_at: {
                "$gte": weeklyDates[i + 1].toString(),
                "$lt": weeklyDates[i].toString()
            },
            status: 'Delivered'
        })

        weeklyOrders.push(weeklyOrder)
    }

    const week1 = weeklyOrders[1] ? weeklyOrders[0].reduce((acc, curr) => acc + Number(curr.total_price), 0) : 0
    const week2 = weeklyOrders[2] ? weeklyOrders[1].reduce((acc, curr) => acc + Number(curr.total_price), 0) : 0
    const week3 = weeklyOrders[3] ? weeklyOrders[2].reduce((acc, curr) => acc + Number(curr.total_price), 0) : 0
    const week4 = weeklyOrders[4] ? weeklyOrders[3].reduce((acc, curr) => acc + Number(curr.total_price), 0) : 0

    res.status(200).json({
        success: true,
        orderCount: orders.length,
        orders,
        sales: {
            total: totalSales,
            weekly: [
                {
                    fromDate: new Date(weeklyDates[1]),
                    toDate: new Date(weeklyDates[0]),
                    total: week1
                },
                {
                    fromDate: new Date(weeklyDates[2]),
                    toDate: new Date(weeklyDates[1]),
                    total: week2
                },
                {
                    fromDate: new Date(weeklyDates[3]),
                    toDate: new Date(weeklyDates[2]),
                    total: week3
                },
                {
                    fromDate: new Date(weeklyDates[4]),
                    toDate: new Date(weeklyDates[3]),
                    total: week4
                }
            ]
        }
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

        for (var i = 0; i < stocks.length; i++) {
            stocks[i].isSold = false
            stocks[i].isArchived = false
            stocks[i].dateSold = null

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