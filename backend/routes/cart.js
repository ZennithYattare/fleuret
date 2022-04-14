const express = require('express')
const router = express.Router()
const User = require('../models/user')

const { isAuthenticatedUser } = require('../middlewares/auth')

const cart = require('../controllers/cartController')

router.route('/carts').get(isAuthenticatedUser, cart.getUserCart)
router.route('/carts').put(isAuthenticatedUser, cart.updateUserCart)
router.route('/carts/add').put(isAuthenticatedUser, cart.addToExistingCart)
router.route('/carts/remove/:id').put(isAuthenticatedUser, cart.removeProductFromCart)
router.route('/carts/add/:id').put(isAuthenticatedUser, cart.addProductToCart)

// router.route('/update/cart/:id').put(isAuthenticatedUser, cart.updateCart)
// router.route('/remove/cart/:id').put(isAuthenticatedUser, cart.removeFromCart)
// router.route('/update-quantity/cart').put(isAuthenticatedUser, cart.updateQuantity)

module.exports = router
