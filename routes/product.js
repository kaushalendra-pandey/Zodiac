const express = require("express")
const router = express.Router()
const {isSignedIn,isAdmin,isAuthorized} = require('../controllers/auth')
const {getProductById} = require("../controllers/product")
const {getUserById} = require("../controllers/user")

//params
router.param("userId",getUserById)
router.param("productID",getProductById)

//ROUTES:



module.exports = router