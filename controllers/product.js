const Product = require('../models/product')

const getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({error:"No such product exist..."})
        }
        req.product = product
        next()
    })
}

module.exports = {getProductById}