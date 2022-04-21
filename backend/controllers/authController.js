const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const passVal = require('../utils/passwordValidation')
const Cart = require('../models/cart')
const Order = require('../models/order')

// templates
// const verifyEmail = require('../config/templates/verifyEmail')

exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) { return next(new ErrorHandler('Please enter your credentials', 400)) }

    const userEmail = await User.findOne({ email }).select('+password')
    const userUsername = await User.findOne({ username: email }).select('+password')

    if (!userEmail && !userUsername) { return next(new ErrorHandler('Invalid Credentials', 401)) }

    if (userEmail) {
        const isPasswordMatched = await userEmail.comparePassword(password)
        if (!isPasswordMatched) { return next(new ErrorHandler('Invalid Credentials', 401)) }

        const user = await User.findByIdAndUpdate(userEmail._id, { last_logged_in: new Date(Date.now()), isDeactivated: false, expiresAt: null }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        sendToken(user, 200, res)
    }

    if (userUsername) {
        const isPasswordMatched = await userUsername.comparePassword(password)
        if (!isPasswordMatched) { return next(new ErrorHandler('Invalid Credentials', 401)) }

        const user = await User.findByIdAndUpdate(userUsername._id, { last_logged_in: new Date(Date.now()), isDeactivated: false, expiresAt: null }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        sendToken(user, 200, res)
    }
})

exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) { return next(new ErrorHandler('Email does not exist', 404)) }

    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const link = `${req.protocol}://${process.env.HOST}/password/reset/${resetToken}`

    try {
        // const message = await resetPassword({ link })

        await sendEmail({
            email: user.email,
            subject: 'FleuretPH/TK Password Recovery',
            message:
                `
            <div class = "container " style = "width= 30px; text-align: center; padding: 10px; background-color: #EDEDED;">
            <img src="https://res.cloudinary.com/fiorexwebapp/image/upload/v1649059138/logo/logo2_d04lyc.png" alt="Fleuret PH/TK logo" width = "200" style = "margin: auto" />
                <div class = "header" style = "background-color: #6C4A4A; color: white; padding: 4px; position: absolute;" width: "20" >
                    <h2 style = "text-align: center">Reset Password</h2>
                </div>
                <div class = "bodyContainer" style = "background-color: #EDEDED; color: black; padding: 25px; position: absolute;">
                    <h3 style = "text-align: center">There was a request to change your password!</h3>
                    <p style = "text-align: center">Please click this to change your password: </p>
                        <div class = "buttonContainer " style = "text-align: center">
                        <a href= "${link}" style = "text-align: center; text-decoration: none;  border: 2px solid #C89595; width: 50px; padding: 0.4rem 1.8rem; background-color: #C89595; border-radius: 15px; color: white;">Click here to reset your password</a>
                        </div>
                    <p style = "text-align: center">Otherwise, if you did not make this request, please ignore this email.</p>
                    <p>An alternative way to access the link for resetting the password: ${link}</p>
                    </div>
                  
            </div>`
        })

        res.status(200).json({
            success: true,
            message: `Email sent.\nKindly check your inbox or spam.`
        })

    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const { password, confirmPassword } = req.body

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) { return next(new ErrorHandler('Password reset link is invalid or has expired')) }
    if (passVal.validate(req.body.password) !== true) { return next(new ErrorHandler('Please follow password format', 400)) }
    if (password !== confirmPassword) { return next(new ErrorHandler('Password does not match')) }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(200).json({
        success: true,
        message: `Password has been updated`
    })
})

exports.registerCustomer = catchAsyncErrors(async (req, res, next) => {
    const { email, username, password, confirmPassword } = req.body

    const userEmail = await User.findOne({ email })
    const userUsername = await User.findOne({ username })

    const role = "Customer"
    const cart = []

    if (userEmail || userUsername) { return next(new ErrorHandler('Email account or username already exists', 404)) }
    if (passVal.validate(req.body.password) !== true) { return next(new ErrorHandler('Please follow password format', 400)) }
    if (password !== confirmPassword) { return next(new ErrorHandler('Password does not match')) }

    const registerToken = jwt.sign({ ...req.body, role, cart }, process.env.ACCOUNT_TOKEN, { expiresIn: process.env.REGISTER_EXPIRES })

    // create reset password url
    const link = `${req.protocol}://${process.env.HOST}/verify/${registerToken}`

    try {
        // const message = await verifyEmail({ link })

        await sendEmail({
            email: email,
            subject: 'FleuretPH/TK Account Verification',
            message: `
            <div class = "container " style = "width= 30px; text-align: center; padding: 10px; background-color: #EDEDED;">
            <img src="https://res.cloudinary.com/fiorexwebapp/image/upload/v1649059138/logo/logo2_d04lyc.png" alt="Fleuret PH/TK logo" width = "200" style = "margin: auto" />
                <div class = "header" style = "background-color: #6C4A4A; color: white; padding: 4px; position: absolute;" width: "20" >
                    <h2 style = "text-align: center">You're almost there</h2>
                </div>
                <div class = "bodyContainer" style = "background-color: #EDEDED; color: black; padding: 25px; position: absolute;">
                    <h3 style = "text-align: center">Thank you for signing up to Fleuret PH/TK</h3>
                    <p style = "text-align: center">Please click the button below to verify your email address and verify your account </p>
                        <div class = "buttonContainer " style = "text-align: center">
                        <a href= "${link}" style = "text-align: center; text-decoration: none;  border: 2px solid #C89595; width: 50px; padding: 0.4rem 1.8rem; background-color: #C89595; border-radius: 15px; color: white;">Verify Email</a>
                        </div>
                    <p style = "text-align: center">Please note that this link will expire within 30 minutes</p>
                    <p>An alternative link to verify your email: ${link}</p>
                    </div>
                  
            </div>`
        })

        res.status(200).json({
            success: true,
            message: `Account verification link is now sent \n please check your inbox or spam`
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

exports.verifyCustomer = catchAsyncErrors(async (req, res, next) => {
    const token = req.params.token

    if (token) {
        jwt.verify(token, process.env.ACCOUNT_TOKEN, function (err, customer) {
            if (err) { return next(new ErrorHandler('Token is invalid or expired')) }

            const { email } = customer

            User.findOne({ email }).exec((err, existingUser) => {
                if (existingUser) { return next(new ErrorHandler('Email already exists')) }
                // await User.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 30 })

                const user = User.create(customer).then((data) => {
                    Cart.create({ user: data._id })
                    res.status(201).json({
                        success: true,
                        message: "Congratulations! Your FleuretPH/TK account has been successfully registered. You may now log in."
                    })
                }
                )
            })
        })
    } else {
        return next(new ErrorHandler('Token is invalid or expired'))
    }
})

exports.registerStaff = catchAsyncErrors(async (req, res, next) => {
    const { email, username, password, role, confirmPassword } = req.body

    if (passVal.validate(req.body.password) !== true) { return next(new ErrorHandler('Please follow password format', 400)) }
    if (password !== confirmPassword) { return next(new ErrorHandler('Password does not match')) }

    let userRole = role ? role : "Staff"
    const cart = []

    const userEmail = await User.findOne({ email })
    const userUsername = await User.findOne({ username })

    if (userEmail || userUsername) { return next(new ErrorHandler('Email account or username already exists', 404)) }

    const user = await User.create({ ...req.body, role: userRole, cart })

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user
    })
})

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    const { oldPassword, password, confirmPassword } = req.body
    const isMatched = await user.comparePassword(oldPassword)

    if (!isMatched) { return next(new ErrorHandler('Old password is incorrect')) }
    if (passVal.validate(req.body.password) !== true) { return next(new ErrorHandler('Please follow password format', 400)) }
    if (password !== confirmPassword) { return next(new ErrorHandler('Password and Confirm Password does not match')) }

    user.password = password

    await user.save()
    sendToken(user, 200, res)
})

exports.getMyProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

exports.deactivate = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ "user._id": req.user._id, status: { $in: ['Order Placed', 'Processing'] } })

    if (orders.length > 0) {
        console.log(orders)
        console.log('here')
        return next(new ErrorHandler(`User has existing orders. Cannot deactivate.`))
    }

    var oldDateObj = new Date()
    var expiresAt = new Date()
    expiresAt.setTime(oldDateObj.getTime() + 43200 * 60 * 1000) //5 * 60 * 1000 milliseconds 

    const user = await User.findByIdAndUpdate(req.user.id, { isDeactivated: true, expiresAt }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: 'deactivated'
    })
})

exports.updateMyProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

exports.getUsers = catchAsyncErrors(async (req, res, next) => {
    const { role, isDeactivated } = req.params
    let users

    if (role === 'all') {
        users = await User.find().sort({ role: 1, first_name: 1 })
    } else {
        users = await User.find({ role }).sort({ role: 1, first_name: 1 })
    }

    res.status(200).json({
        success: true,
        users
    })
})

exports.getDeactivatedUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ isDeactivated: true }).sort({ role: 1, first_name: 1 })

    res.status(200).json({
        success: true,
        users
    })
})

exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) { return next(new ErrorHandler(`User not found with this id:(${req.params.id})`)) }

    res.status(200).json({
        success: true,
        user
    })
})

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    if (!user) { return next(new ErrorHandler(`User not found with this id:(${req.params.id})`)) }

    res.status(200).json({
        success: true,
        user,
        message: "User successfully updated"
    })
})

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) { return next(new ErrorHandler(`User not found with this id:(${req.params.id})`)) }

    await user.remove()

    res.status(200).json({
        success: true,
        message: "User has been deleted"
    })
})

