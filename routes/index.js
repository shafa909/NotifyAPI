var express = require('express');
const appController = require('../controllers/appController');
var router = express.Router();


const { verifyToken } = require("../controllers/helper/authHelper")

router.post('/register', appController.registerUser);
router.post('/login', appController.loginUser);

module.exports = router;