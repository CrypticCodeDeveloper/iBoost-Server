var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {renderIndex} = require("../controllers/indexController");

/* GET home page. */
router.get('/', authMiddleware, renderIndex);


module.exports = router;
