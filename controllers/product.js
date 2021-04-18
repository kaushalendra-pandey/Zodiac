const Product = require('../models/product')
const formidable = require("formidable")
const _ = require("lodash")
const fs = require('fs')
const {check,validationResult} = require("express-validator")


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

const createProduct = (req,res) => {

    // const errors = validationResult(req)
    // if(!errors.isEmpty()){
    //     return res.status(400).json({error:errors.array()[0].msg})
    // }

    let form =  new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,file) => {
        if(err){
            res.status(400).json({
                error:"Not a valid image!!!"
            })
        }

        let product = new Product(fields)

        //handle the file:
        if(file.photo){
            if(file.photo.size > 3*1024*1024){
                return res.status(400).json({error:"File size too big!!!"})
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to the db:
        product.save((err,product)=>{
            if(err){
                res.status(400).json({error:"Saving the product failed.."})
            }
            res.json(product)
        })

    })

}

const getAllProducts = (req,res) => {
    let limit = req.query.limit ? req.query.limit : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : ''

    Product.find()
    .populate("category")
    .select("-photo")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err || !products){
            res.status(400).json({error:"No product exist!!!"})
        }
        res.json(products)
    })
}

const getProduct = (req,res) => {
    // this is done for optimization as loading image will take time.
    // we will create a middleware to load image in background!
    req.product.photo = undefined
    res.json(req.product)
}

const updateProduct = (req,res) => {
    let form =  new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,file) => {
        if(err){
            res.status(400).json({
                error:"Not a valid image!!!"
            })
        }

        //updation code...
        let product = req.product
        _.extend(product,fields)


        //handle the file:
        if(file.photo){
            if(file.photo.size > 3*1024*1024){
                return res.status(400).json({error:"File size too big!!!"})
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to the db:
        product.save((err,product)=>{
            if(err){
                res.status(400).json({error:"Updation failed.."})
            }
            res.json(product)
        })

    })
}

const deleteProduct = (req,res) => {
    const product = req.product
    product.remove((err,deletedProduct)=>{
        if(err){
            res.status(400).json({error:"Unable to delete the product.."})
        }
        res.json(deletedProduct)
    })
}

const getAllUniqueCategories = (req,res) => {
    Product.distinct("categories",(err,categories)=>{
        if(err){
            res.status(400).json({error:"No unique Category!!"})
        }
        res.json(categories)
    })
}

//middleware
const updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prods => {
        return {
            updateOne:{
                filter : {_id:prod._id},
                update: {$inc :{stock :-prod.count ,sold : +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,(err,products)=>{
        if(err){
            res.status(400).json({error:"Bulk Opeartion failed"})
        }
        next()
    })
}



module.exports = {getProductById,
    createProduct,
    getProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    updateStock,
    getAllUniqueCategories
}