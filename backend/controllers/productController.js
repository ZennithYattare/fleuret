const Product = require('../models/product')
const Stock = require('../models/stock')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary').v2

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    // req.body.user = req.user.id
    const images = req.files

    if (images.length === 0) {
        return next(new ErrorHandler('Images not found', 404))
    }

    const product = await Product.create({ ...req.body, images, created_by: req.user.id })

    res.status(201).json({
        success: true,
        message: "New product added!",
        product
    })
})

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()

    const products = await apiFeatures.query
    const productCount = products.length

    res.status(200).json({
        success: true,
        productCount,
        products
    })
})

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) { return next(new ErrorHandler('Product not found', 404)) }

    res.status(200).json({
        success: true,
        product
    })
})

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) { return next(new ErrorHandler('Product not found', 404)) }

    let newImages = req.files

    const oldImages = product.images
    const length = oldImages && oldImages.length
    let ids = []

    for (let i = 0; i < length; i++) {
        ids.push(oldImages[i].filename)
    }

    if (newImages == null || newImages == '') {
        newImages = product.images
    } else {
        if (ids.length != 0) {
            for (let x = 0; x < ids.length; x++) {
                cloudinary.uploader.destroy(ids[x],
                    { resource_type: 'raw' })
            }
        }
    }

    product = await Product.findByIdAndUpdate(req.params.id, {
        ...req.body,
        images: newImages
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})

exports.archiveProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) { return next(new ErrorHandler('Product not found', 404)) }

    const stocks = await Stock.find({ product: product._id, isArchived: false })

    for (var i = 0; i < stocks.length; i++) {
        stocks[i].autoArchive = !product.isArchived
        await stocks[i].save()
    }

    /**
     * product.isArchived = true, means product alr archived when clicked therefore restore
     * --restore stock# too
     * --stock restore will be done sa stockController
     * product.isArchived = false, means product not alr archived when clicked, therefore archive
     * --set stock to 0
     */


    product = await Product.findByIdAndUpdate(req.params.id, {
        isArchived: !product.isArchived,
        stock: product.isArchived ? product.archivedStocks : 0,
        archivedStocks: product.isArchived ? 0 : product.stock
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) { return next(new ErrorHandler('Product not found', 404)) }

    const images = product.images
    const length = images.length
    let ids = []

    for (let i = 0; i < length; i++) {
        ids.push(images[i].filename)
    }

    if (ids.length != 0) {
        for (let x = 0; x < ids.length; x++) {
            cloudinary.uploader.destroy(ids[x],
                { resource_type: 'raw' })
        }
    }

    const stocks = await Stock.find({ product: product._id })

    for (var i = 0; i < stocks.length; i++) {
        await stocks[i].remove()
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: 'Product is deleted successfully',
        stocks: stocks.length
    })
})