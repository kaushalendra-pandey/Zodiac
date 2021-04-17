const express = require("express")
const User = require("../models/user")
const router = express.Router()
const {isSignedIn,isAuthorized, isAdmin} = require('../controllers/auth')
const {getUserById,getUser,updateUser} = require("../controllers/user")

router.param('userId',getUserById)

router.get('/user/:userId',isSignedIn,isAuthorized,getUser)
router.put('/user/:userId',isSignedIn,isAuthorized,updateUser)

module.exports = router