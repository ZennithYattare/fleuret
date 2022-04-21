const express = require('express')
const router = express.Router()
const User = require('../models/user')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const auth = require('../controllers/authController')

/* ALL */
router.route('/login').post(auth.login)
router.route('/logout').get(auth.logout)
router.route('/update/password').put(isAuthenticatedUser, auth.updatePassword)
router.route('/password/forgot').post(auth.forgotPassword)
router.route('/password/reset/:token').put(auth.resetPassword)

router.route('/me/profile').get(isAuthenticatedUser, auth.getMyProfile)
router.route('/me/update').put(isAuthenticatedUser, auth.updateMyProfile)
router.route('/me/deactivate').put(isAuthenticatedUser, auth.deactivate)

/* CUSTOMER */
router.route('/customer/register').post(auth.registerCustomer)
router.route('/verify/account/:token').get(auth.verifyCustomer)

/* STAFF */

/* ADMIN */
router.route('/staff/register').post(isAuthenticatedUser, authorizeRoles('Admin'), auth.registerStaff)
router.route('/user/:id').get(isAuthenticatedUser, authorizeRoles('Admin'), auth.getUser)
router.route('/users/:role').get(isAuthenticatedUser, authorizeRoles('Admin'), auth.getUsers)
router.route('/deactivated/users').get(isAuthenticatedUser, authorizeRoles('Admin'), auth.getDeactivatedUsers)
router.route('/staff/update/:id').put(isAuthenticatedUser, authorizeRoles('Admin'), auth.updateUser)
router.route('/staff/delete/:id').delete(isAuthenticatedUser, authorizeRoles('Admin'), auth.deleteUser)


module.exports = router