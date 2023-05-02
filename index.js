const express = require("express")
const cors = require("cors")
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors())



//import 
const {Connection} = require('./config/db')
const {userRouter}  =require("./routes/user.route")
const {postRouter}  = require("./routes/post.route")

//base end-point
app.get('/',(req,res)=>{
    res.send("welcome")
})

app.use("/api",userRouter)
app.use("/api",postRouter)


app.listen(process.env.PORT,async()=>{
    try{
        await Connection
    }
    catch(err){
        console.log("Error:",err)
    }
    console.log("server running")
})