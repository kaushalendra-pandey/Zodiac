const Category = require("../models/category")

const getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category)=>{
        if(err){
            console.log(err);
            return res.status(400).json({error:"No such category exist!!!"})
        }
        req.category = category
        next()
    })
}

const createCategory = (req,res) => {
    const {name} = req.body 
    if(!name || name.length < 5){
        return res.status(400).json({error:"Invalid name for the category!!!"})
    }
    const category = new Category(req.body)
    category.save((err,thisCategory)=>{
        if(err){
            return res.status(400).json({error:"Cannot save the category!!!"})
        }
        res.json({category:thisCategory})
    })
}

const getCategory = (req,res) =>{
    res.json(req.category)
}

const getAllCategories = (req,res) => {
    category = Category.find().exec((err,thisCategory)=>{
        if(err || !thisCategory){
            return res.status(400).json({error:"No category exist!!!"})
        }
        res.json({categories:thisCategory})
    })
    

}

const updateCategory = (req,res) => {
    const category = req.category
    console.log(category);
    console.log(req.body);
    if(!req.body.name || req.body.name.length < 5){
        return res.status(400).json({error:"Invalid category name"})
    }
    category.name = req.body.name
    category.save((err,thisCategory)=>{
        if(err){
            return res.status(400).json({error:"Unable to update category!!"})
        }
        res.json({category:thisCategory})
    })
}

const removeCategory = (req,res) => {
    const category = req.category
    category.remove((err,thisCategory)=>{
        if(err){
            res.status(400).json({error:"Unable to delete category!"})
        }
        res.json({category:thisCategory})
    })
}

module.exports = {getCategoryById,createCategory,getCategory,getAllCategories,updateCategory,removeCategory} 