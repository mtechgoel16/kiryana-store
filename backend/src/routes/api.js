const express = require('express');
const router = express.Router();
const inv = require('../controllers/inventoryController');
const ord = require('../controllers/orderController');
const ath = require('../controllers/authController');
const rev = require('../controllers/reviewController');

router.get('/products', inv.getAllProducts);
router.get('/products/:id', inv.getProductById);
router.get('/admin/analytics', inv.getDashboardAnalytics);
router.post('/orders', ord.createOrder);
router.post('/auth/login', ath.loginWithPhone);
router.post('/reviews', rev.submitReview);
router.get('/reviews', rev.getStoreReviews);
module.exports = router;
