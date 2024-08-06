const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartControllers.js');
const auth = require('../middlewares/auth.js');

router.post('/', auth('user'),CartController.createCart)

router.get('/:cid',auth(['user', 'admin', 'premium']), CartController.getCartById);

router.delete('/:cartId/products/:productId',auth('user'), CartController.removeProductFromCart);
  
router.delete("/:cartId",auth('user'), CartController.removeAllProducts);
  
router.put('/:cid/products/:pid', auth(['admin', 'premium']), CartController.addOrUpdateProduct);

router.post("/:cid/purchase", auth(['user', 'admin', 'premium']), CartController.finalizePurchase);

module.exports = router;

