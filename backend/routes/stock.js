const express = require('express')
const router = express.Router()

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const stock = require('../controllers/stockController')

router.route('/stocks').get(stock.getAllStocks)
router.route('/stocks/remove/:id').put(stock.updateStocks)
router.route('/stocks/unique').get(stock.getUniqueProduct)
router.route('/stock/:id').get(stock.getSingleStock)

router.route('/new/stock').post(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), stock.createStock)
router.route('/stocks/archived').get(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), stock.getArchivedStocks)
router.route('/stock/:id').put(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), stock.updateStock)
router.route('/stock/archive/:id').put(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), stock.archiveStock)
router.route('/stock/:id').delete(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), stock.deleteStock)
router.route('/stock/update/:id').put(isAuthenticatedUser, stock.updateStock)

module.exports = router
