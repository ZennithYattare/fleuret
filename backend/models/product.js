const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, '100 characters only']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please enter product name'],
        maxLength: [100, '100 characters only']
    },
    images: {
        type: Array,
        required: [true, 'Please enter product image'],
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        required: [true, "Please enter stock"]
    },
    archivedStocks: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Product', productSchema)

