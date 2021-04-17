require('dotenv').config()
const mongoose = require("mongoose")
const express = require("express")
const app  = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")

//routes:
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')

const PORT = process.env.PORT || 8000   


//DB Conection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true

}).then(()=>{
    console.log("DATABASE is connected..");
})


//middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// routes
app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)


app.listen(8000,(req,res)=>{
    console.log(`app is running at ${PORT}`);
})