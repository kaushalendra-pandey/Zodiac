const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const productCartSchema = new mongoose.Schema({
    product:{
        type:ObjectId,
        red:"Product"
    },
    name:String,
    count:Number,
    price:Number,

})

const orderSchema = new mongoose.Schema({
    products: [
        productCartSchema
    ],
    transaction_id:{},
    amount:{
        type:Number
    },
    address:{
        type:String
    },
    updated:{
        type:Date
    },
    user:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true})

const PrductCart = mongoose.model("ProductCart",productCartSchema)
const Order = mongoose.model("Order",orderSchema)

module.exports = {PrductCart,Order}