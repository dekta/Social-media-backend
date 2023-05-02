const jwt = require('jsonwebtoken');
require('dotenv').config()



const authenticate = (req,res,next)=>{
    const token = req.headers?.authorization?.split(" ")[1] || req.cookies?.token
    
    if(token){
        jwt.verify(token, process.env.LOGIN,function(err,decoded){
            if(err){
                res.status(401).send({"msg":"please login","err":err.message})
            }
            else{
                UserId = decoded.id
                console.log(UserId)
                res.cookie("userId",UserId,{httpOnly:true})
                next()
            }
        })
    }
    else{
        res.status(401).send({"msg":"please login"})
    }
}


module.exports = {authenticate}