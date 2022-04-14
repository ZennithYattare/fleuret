const mongoose = require('mongoose')
// const validator = require('validator')

const orderSchema = new mongoose.Schema({
    user: {
        first_name: String,
        last_name: String,
        email: String,
        _id: mongoose.Schema.Types.ObjectId,
        contact_number: String
    },
    products: [
        {
            product: {
                _id: mongoose.Schema.Types.ObjectId,
                name: String,
                images: Array,
                price: Number
            },
            quantity: {
                type: Number,
                required: [true, 'Please enter quantity'],
            }
        }
    ],
    delivery_mode: {
        type: String,
        required: [true, 'Please select if delivery or pickup'],
        trim: true
    },
    address: {
        street: String,
        municipality: String,
        province: String,
        zipCode: Number,
        landmark: String
    },
    status: {
        type: String,
        required: true
    },
    order_history: {
        type: Array,
        required: true
    },
    total_price: {
        type: String,
        required: true,
    },
    order_date: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    },
    delivery_date: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    },
    updated_at: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    },
    message: {
        type: String
    },
})

module.exports = mongoose.model('Order', orderSchema)