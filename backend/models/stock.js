const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    refID: {
        type: String
    },
    supplier_name:
    {
        type: String,
        required: [true, 'Please enter supplier name'],
        trim: true,
        maxLength: [100, '100 characters only']
    },
    supplier_contact_number:
    {
        type: String,
        required: [true, 'Please enter supplier contact number'],
    },
    dealers_price: {
        type: Number,
        required: [0, "Please enter stock"]
    },
    initial_date: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    },
    expiry_date: {
        type: Date,
        required: true,
        default: new Date().setFullYear(new Date().getFullYear() + 1)
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false
    },
    isExpired: {
        type: Boolean,
        required: true,
        default: false
    },
    isSold: {
        type: Boolean,
        required: true,
        default: false
    },
    autoArchive: {
        type: Boolean,
        required: true,
        default: false
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

module.exports = mongoose.model('Stock', stockSchema)

