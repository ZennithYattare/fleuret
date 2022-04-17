const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
// const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const { listenerCount } = require('nodemailer/lib/xoauth2')


exports.getUserCart = catchAsyncErrors(async (req, res, next) => {

    const cart = await Cart.findOne({ "user": req.user._id }).populate('user')

    if (!cart) { return next(new ErrorHandler('Orders not found', 404)) }

    await cart.populate(
        {
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }
    )

    res.status(200).json({
        success: true,
        cart,
    })
})

exports.updateUserCart = catchAsyncErrors(async (req, res, next) => {

    const { products } = req.body
    const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { products: products }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).populate(
        {
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }
    )

    res.status(200).json({
        success: true,
        cart
    })
})

exports.addToExistingCart = catchAsyncErrors(async (req, res, next) => {

    const { products } = req.body

    let oldCart = await Cart.findOne({ user: req.user._id })

    if (!oldCart) {
        oldCart = Cart.create({ user: req.user._id })
    }

    products.forEach(({ product, quantity }) => {
        if (!oldCart.products.some(cart => cart.product.toString() === product._id.toString())) {
            oldCart.products = [...oldCart.products, { product: product._id, quantity: quantity }]
        }
    })

    await oldCart.save()

    res.status(200).json({
        success: true,
        cart: oldCart
    })
})


exports.removeProductFromCart = catchAsyncErrors(async (req, res, next) => {

    const productId = req.params.id

    const cart = await Cart.findOne({ "user": req.user._id })

    let newProducts = cart.products.filter(({ product }) => product.toString() !== productId.toString())


    cart.products = newProducts

    cart.save()

    await cart.populate(
        {
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }
    )


    res.status(200).json({
        success: true,
        cart
    })
})

exports.addProductToCart = catchAsyncErrors(async (req, res, next) => {

    const productId = req.params.id
    const { quantity } = req.body

    const cart = await Cart.findOne({ "user": req.user._id })

    let newProducts = cart.products
    newProducts.push({ product: productId, quantity: quantity })

    cart.products = newProducts


    cart.save()

    await cart.populate(
        {
            path: 'products',
            populate: {
                path: 'product',
                model: 'Product'
            }
        }
    )


    res.status(200).json({
        success: true,
        cart
    })
})