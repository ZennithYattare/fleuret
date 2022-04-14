const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    last_name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    contact_number: {
        type: String,
        required: [true, 'Please enter your contact number'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Passwords must be at least 6 characters long'],
        select: false
    },
    username: {
        type: String,
        required: [true, 'Please enter your username'],
        minLength: [6, 'Username must be at least 6 characters long'],
        maxLength: [10, 'Username must be at most 10 characters long']
    },
    address: {
        street: {
            type: String
        },
        municipality: {
            type: String
        },
        province: {
            type: String
        },
        zipCode: {
            type: String
        },
        landmark: {
            type: String
        }
    },
    last_logged_in: {
        type: Date
    },
    role: {
        type: String,
        required: [true, 'Please enter your role']
    },
    cart: {
        type: Array
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        expires: 1
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// Encrypting password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

// Generate Password reset token
userSchema.methods.getResetPasswordToken = function () {
    // generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //encrypt token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //set token expire times                30 minutes
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('User', userSchema)