const User = require("../models/user")
const validator = require("validator")
const Order = require("../models/order")

const getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(403).json({errro:"No such user exist!!"})
        }
        req.profile = user
        next()
    })

}

const getUser = (req,res,next) => {
    req.profile.password = undefined
    return res.json(req.profile)
    next()
}

const updateUser = (req,res,next) => {
    const {name,email} = req.body

    if(!name && !email){
        return res.status(402).json({error:"Invalid inputs.."})
    }

    if (name && name.length < 4){
        return res.status(402).json({error:"Invalid name"})
    }

    if (email && !validator.isEmail(email)){
        return res.status(402).json({error:"Invalid email"})
    }
    

    User.findByIdAndUpdate({_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({error:"Yor are not authorized to update!!"})
            }
            user.password=undefined
            res.json(user)
            
        })
}

const userPurachaseList = (req,res,next) => {
    Order.find({user:req.profile._id})
    .populate("user","_id name email")
    .exec((err,order)=>{
        if(err){
            return res.status(402).json({error:"No purchase for this user"})
        }
        return res.json(order)
    })

}

const pushOrderInPrachaseList = (req,res,next)=>{
    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id:product._id,
            name:product._id,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id

        })
    })

    //store this in DB
    User.findOneAndUpdate({_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchase)=>{
            if(err){
                return res.status(402).json({error:"Unable to save purchase list"})
            }
            next()
        })


   
}
module.exports = {getUser,getUserById,updateUser,userPurachaseList,pushOrderInPrachaseList}