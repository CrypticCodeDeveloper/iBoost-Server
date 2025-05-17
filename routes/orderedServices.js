const express = require('express');
const router = express.Router();
const { createNewServiceOrder,
    updateServiceStatus,
    getPendingOrders,
    getAllServiceOrders,
    getOrderTotals,
} = require('../controllers/orderedServicesController')
const authMiddleware = require('../middlewares/authMiddleware');
const validateAdmin = require('../middlewares/validateAdmin');

router.post('/', authMiddleware, createNewServiceOrder)
router.get('/', authMiddleware, validateAdmin, getAllServiceOrders)
router.get('/pending-orders', authMiddleware, validateAdmin, getPendingOrders)
router.post('/update-status/:id', authMiddleware, validateAdmin, updateServiceStatus)
router.get('/orders-amount', authMiddleware, validateAdmin, getOrderTotals)
module.exports = router;