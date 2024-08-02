const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ProductController = require('../controllers/productControllers');

router.get('/', auth(['user', 'admin', 'premium']), ProductController.getProducts);

router.get('/products', auth(['user', 'admin', 'premium']), ProductController.getProductsAvailable);

router.get('/:id', auth(['user', 'admin', 'premium']), ProductController.getProductById);

router.post('/', auth(['user', 'admin', 'premium']), ProductController.createProduct);

router.put('/:id', auth(['user', 'admin', 'premium']), ProductController.updateProduct);

router.delete('/:id', auth(['user', 'admin', 'premium']), ProductController.deleteProduct);

module.exports = router;
