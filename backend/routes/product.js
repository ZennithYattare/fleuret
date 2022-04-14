const express = require('express')
const router = express.Router()
const fileStorage = require('../config/productImages')
const path = require('path')
const multer = require('multer')

const fileMimeTypes = [
    'image/jpeg',
    'image/png',
    'images/jpg',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]

const fileUpload = multer({
    storage: fileStorage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        if (!fileMimeTypes.includes(file.mimetype)) {
            return cb(new Error('File type not supported'))
        } else {
            cb(null, true)
        }
    }
})

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const product = require('../controllers/productController')

router.route('/products').get(product.getAllProducts)
router.route('/product/:id').get(product.getSingleProduct)

router.route('/new/product').post(isAuthenticatedUser, fileUpload.array('images'), authorizeRoles('Admin', 'Staff'), product.createProduct)
router.route('/product/:id').put(isAuthenticatedUser, fileUpload.array('images'), authorizeRoles('Admin', 'Staff'), product.updateProduct)
router.route('/product/archive/:id').put(isAuthenticatedUser, fileUpload.array('images'), authorizeRoles('Admin', 'Staff'), product.archiveProduct)
router.route('/product/update/:id').put(isAuthenticatedUser, fileUpload.array('images'), product.updateProduct)
router.route('/product/:id').delete(isAuthenticatedUser, authorizeRoles('Admin', 'Staff'), product.deleteProduct)

module.exports = router
