const express = require('express');
const router = express.Router();
const {createNewUser,
    loginUser,
} = require('../controllers/authController');

router.post('/sign-up', createNewUser)
router.post('/sign-in', loginUser)

module.exports = router;