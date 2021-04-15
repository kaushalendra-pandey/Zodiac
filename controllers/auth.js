const User = require("../models/user")
const {check,validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")

const signin = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({error:errors.array()[0].msg})
    }
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(402).json({error:"No such user exist..."})
        }
        const isPasswordMatched = await bcrypt.compare(password,user.password)
        if(!isPasswordMatched){
            return res.status(402).json({error:"Invalid Credentials.."})
        }
        
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        res.cookie("token",token,{expire: new Date() + 9999})

        const {_id,name,role} = user
        res.json({message:"User is logged in successfully",user:{id:_id,name,email,role}})

    } catch (error) {
        console.log(error);
        res.status(403).json({error:"Some internal error occue"})
    }
    

}

const signout = (req,res) => {
    res.clearCookie("token")

    res.json({message:"sign out successfull!!!"})
}

const signup = async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({error:errors.array()[0].msg})
    }
    try {
        const user = new User(req.body)
        await user.save()
        res.json({message:"success",user})

        
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"SOmething went wrong!!!"})
    }
    
    
}

// custom middleware:
const isSignedIn = expressJWT({
    secret:process.env.SECRET,
    userProperty:"auth"
})

const isAuthorized = (req,res,next) => {
    const checker = req.profile && req.auth && req.profile._id === req.auth._id
    if(!checker){
        return res.status(403).json({error:"Access Denied!!!"})
    }
    next()
}

const isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({error:"You are not authorized for this action.."})
    }
    next()
}

module.exports = {signout,signup,signin,isSignedIn,isAdmin,isAuthorized}