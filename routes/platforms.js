const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {getAllPlatforms, createPlatform, deletePlatform, editPlatform,getPlatform} = require("../controllers/platformController");
const validateAdmin = require('../middlewares/validateAdmin');

router.get('/', authMiddleware, getAllPlatforms)
router.get('/:id', authMiddleware, getPlatform)
router.post('/', authMiddleware, validateAdmin, createPlatform)
router.patch('/:id', authMiddleware, validateAdmin, editPlatform)
router.delete('/:id', authMiddleware, validateAdmin, deletePlatform)

module.exports = router;