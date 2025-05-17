var express = require('express');
var router = express.Router();
const { getAllUsers, getUserById, getUserWallet, getUserTransactions} = require('../controllers/usersController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById)
router.get('/wallet/:id', authMiddleware, getUserWallet)
router.get('/transaction/:id', authMiddleware, getUserTransactions)

module.exports = router;
