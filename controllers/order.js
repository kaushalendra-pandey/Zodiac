const {Order, ProdutCart} = require("../models/order")

const getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({error:"No order exist"})
        }
        req.order = order
    })
}

const createOrder = (req,res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({error:"Failed to save your order in DB.."})
        }
        res.json(order)
    })
}

const getAllOrders = (req,res) => {
    Order.find()
    .populate("user","_id name")
    .exec((err,orders)=>{
        if(err){
            return res.status(400).json({error:"No Orders found in DB.."})
        }
        res.json(orders)
    })
}

const getStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValue)
}

const updateStatus = (req,res) => {
    Order.update({_id:req.body.id},
        {$set:{status:req.body.status}},
        (err,order)=>{
            if(err){
                res.status(400).json({error:"Cannot update the status..."})
            }
            res.json(order)
        })
}

module.exports = {getOrderById,createOrder,getAllOrders,getStatus,updateStatus}