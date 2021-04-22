const express = require("express")
const router = express.Router()
const {isSignedIn,isAdmin,isAuthorized} = require('../controllers/auth')
const {getUserById,pushOrderInPrachaseList} = require("../controllers/user")
const {updateStock} = require('../controllers/product')
const {getOrderById, createOrder,getAllOrders,getStatus,updateStatus} = require("../controllers/order")
const { route } = require("./auth")

//params
router.param("userId",getUserById)
router.param("orderId",getOrderById)

//READ..
router.get("/order/all/:userId",isSignedIn,isAuthorized,isAdmin,getAllOrders)

//CREATE...
router.post("/order/create/:userId",isSignedIn,isAuthorized,pushOrderInPrachaseList,updateStock,createOrder)

//status of Order:
router.get("/order/status/:userId/:orderId",isSignedIn,isAuthorized,isAdmin,getStatus)
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthorized,isAdmin,updateStatus)

module.exports = router