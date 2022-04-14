const express = require('express')
const router = express.Router()
const Order = require('../models/order')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const order = require('../controllers/orderController')


 router.route('/orders/').get(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), order.getAllOrders)
 router.route('/me/orders/').get(isAuthenticatedUser, order.getAllUserOrders)
 router.route('/order/:id').get(isAuthenticatedUser, order.getSingleOrder)
 router.route('/order/new').post(isAuthenticatedUser, order.createOrder)
 router.route('/order/:id').put(isAuthenticatedUser, order.updateOrder)
 router.route('/order/:id').delete(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), order.deleteOrder)

module.exports = router