const express = require("express")
const router = express.Router()
const {getCategoryById,createCategory,getAllCategories,getCategory,updateCategory,removeCategory} = require("../controllers/category")
const {isAuthorized,isAdmin,isSignedIn} = require('../controllers/auth')
const {getUserById} = require("../controllers/user")

router.param("userId",getUserById)
router.param("categoryId",getCategoryById)

//CREATE ROUTE..
router.post("/category/create/:userId",
            isSignedIn,
            isAuthorized,
            isAdmin,
            createCategory)

// READ ROUTES..
router.get("/categories",
            getAllCategories)
            
router.get("/category/:categoryId",
            getCategory)


//UPDATE ROUTE...
router.put("/category/:categoryId/:userId",
            isSignedIn,
            isAuthorized,
            isAdmin,
            updateCategory)

//Delete route...
router.delete("/category/:categoryId/:userId",
               isSignedIn,
               isAuthorized,
               isAdmin,
               removeCategory)
module.exports = router
