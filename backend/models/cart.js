const mongoose = require('mongoose')
// const validator = require('validator')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: [true, 'Please enter quantity'],
            }
        }
    ]
})

module.exports = mongoose.model('Cart', cartSchema)