const express = require("express")
const router = express.Router()
const {signout,signup,signin, isSignedIn} = require("../controllers/auth")
const {check,validationResult} = require("express-validator")


router.post('/signup',
    check("name").isLength({min:3}).withMessage("Enter a valid name!"),
    check("email").isEmail().withMessage("Enter a valid email"),
    check("password").isLength({min:3}).withMessage("Password must be 3 character long..")

    ,signup)

router.post("/signin",
        
        check("email").isEmail().withMessage("Enter a valid email"),
        check("password").isLength({min:3}).withMessage("Password must be 3 character long..")

        ,signin)

router.get("/signout",signout)


module.exports = router