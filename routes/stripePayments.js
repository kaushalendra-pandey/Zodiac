const express =  require("express")
const { makePayment } = require("../controllers/stripePayment")
const { getUserById } = require("../controllers/user")
const router = require("./order")


router.post("/stripepayment",makePayment)

module.exports = router