const Stock = require("../models/stock");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const { v4: uuid_v4 } = require("uuid");
const Product = require("../models/product");

exports.createStock = catchAsyncErrors(async (req, res, next) => {
  const { quantity } = req.body;
  var stockList = [];
  for (var i = 0; i < quantity; i++) {
    var stock = await Stock.create(req.body);
    await stock.populate("product");
    stockList.push(stock);
  }

  const product = await Product.findById(req.body.product);

  product.stock = Number(product.stock) + Number(quantity);
  product.archivedStocks = 0;
  product.isArchived = false;

  await product.save();

  res.status(201).json({
    success: true,
    message: "New stock added!",
    stockList,
  });
});

exports.getUniqueProduct = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 10;

  const apiFeatures = new APIFeatures(
    Stock.find().distinct("product"),
    req.query
  )
    .search()
    .filter()
    .pagination(resPerPage);

  const stocks = await apiFeatures.query;
  const stockCount = stocks.length;

  res.status(200).json({
    success: true,
    stockCount,
    stocks,
  });
});

exports.getAllStocks = catchAsyncErrors(async (req, res, next) => {
  const dateToday = new Date(Date.now());

  const expiredStocks = await Stock.find({ expiry_date: { $lte: dateToday } });

  for (var i = 0; i < expiredStocks.length; i++) {
    // expiredStocks[i].isArchived = true;
    expiredStocks[i].isExpired = true;
    await expiredStocks[i].save();
  }

  const stocks = await Stock.find({
    $or: [{ isArchived: false }, { autoArchive: false }],
  }).populate("product");

  res.status(200).json({
    success: true,
    stocks,
  });
});

exports.getStockData = catchAsyncErrors(async (req, res, next) => {
  const expiredStocks = await Stock.find({ isExpired: true });
  const soldStocks = await Stock.find({ isSold: true });
  const archivedStocks = await Stock.find({
    $or: [{ isArchived: true }, { autoArchive: true }],
  });

  res.status(200).json({
    success: true,
    stocks: {
      expired: expiredStocks.length,
      sold: soldStocks.length,
      archived: archivedStocks.length,
    },
  });
});

exports.getArchivedStocks = catchAsyncErrors(async (req, res, next) => {
  const dateToday = new Date(Date.now());

  const expiredStocks = await Stock.find({ expiry_date: { $lte: dateToday } });

  for (var i = 0; i < expiredStocks.length; i++) {
    // expiredStocks[i].isArchived = true;
    expiredStocks[i].isExpired = true;
    await expiredStocks[i].save();
  }

  const stocks = await Stock.find({
    $or: [{ isArchived: true }, { autoArchive: true }],
  }).populate("product");
  const stockCount = stocks.length;

  res.status(200).json({
    success: true,
    stockCount,
    stocks,
  });
});

exports.getSingleStock = catchAsyncErrors(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id).populate("product");

  if (!stock) {
    return next(new ErrorHandler("Stock not found", 404));
  }

  res.status(200).json({
    success: true,
    stock,
  });
});

exports.archiveStock = catchAsyncErrors(async (req, res, next) => {
  let stock = await Stock.findById(req.params.id).populate("product");

  if (!stock) {
    return next(new ErrorHandler("Stock not found", 404));
  }

  const product = stock.product;

  if (product.isArchived) {
    return next(
      new ErrorHandler("Cannot restore stock of archived product", 404)
    );
  }

  if (stock.isArchived) {
    product.stock += 1;
    await product.save();
  } else {
    product.stock -= 1;
    await product.save();
  }

  if (product.stock === 0) {
    product.isArchived = true;
    await product.save();
  }

  stock = await Stock.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      isArchived: !stock.isArchived,
      archiveReason: req.body.archiveReason || null
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    stock,
  });
});

exports.updateStock = catchAsyncErrors(async (req, res, next) => {
  let stock = await Stock.findById(req.params.id).populate("product");

  if (!stock) {
    return next(new ErrorHandler("Stock not found", 404));
  }

  stock = await Stock.findByIdAndUpdate(
    req.params.id,
    { ...req.body, isArchived: req.body.isArchived },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    stock,
  });
});

exports.deleteStock = catchAsyncErrors(async (req, res, next) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    return next(new ErrorHandler("Stock not found", 404));
  }

  await stock.remove();

  const prod = await Product.findById(stock.product._id);

  prod.stock = prod.stock - 1;
  await prod.save();

  res.status(200).json({
    success: true,
    message: "Stock is deleted successfully",
    product: prod,
  });
});

exports.updateStocks = catchAsyncErrors(async (req, res, next) => {
  const stocks = await Stock.find({
    product: req.params.id,
    $and: [{ isArchived: false }, { autoArchive: false }],
  });

  const { quantity } = req.body;
  for (var i = 0; i < quantity; i++) {
    await Stock.findByIdAndUpdate(
      stocks[i]._id,
      {
        isSold: true,
        // isArchived: true,
        refID: req.body.refId,
        dateSold: new Date(Date.now()),
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  }

  const prod = await Product.findById(req.params.id);

  if (prod.stock >= quantity) {
    prod.stock = prod.stock - quantity;
    await prod.save();
  }

  await Product.findByIdAndUpdate(
    req.params.id,
    { isArchived: prod.stock === 0 ? true : false },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    product: prod,
  });
});
