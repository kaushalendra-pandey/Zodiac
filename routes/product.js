const express = require("express")
const router = express.Router()
const {isSignedIn,isAdmin,isAuthorized} = require('../controllers/auth')
const {getProductById,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    photo,
    getAllUniqueCategories
} = require("../controllers/product")
const {getUserById} = require("../controllers/user")
const {check,validationResult} = require("express-validator")


//params
router.param("userId",getUserById)
router.param("productId",getProductById)

//ROUTES:

//CREATE
router.post("/product/create/:userId",
            check("name").isLength({min:5}).withMessage("Invalid Product Name"),
            check("description").isLength({max:2000}).withMessage("Description too long!!"),
            
            isSignedIn,isAuthorized,isAdmin,createProduct)

//READ:
router.get("/product/:productId",getProduct)
router.get("/products",getAllProducts)
router.get("/product/photo/:productId",photo)

//UPDATE:
router.put("/product/:productId/:userId",isSignedIn,isAuthorized,isAdmin,updateProduct)

// DELETE:
router.delete("/product/:productId/:userId",isSignedIn,isAuthorized,isAdmin,deleteProduct)

router.get("/product/categories",getAllUniqueCategories)

module.exports = router