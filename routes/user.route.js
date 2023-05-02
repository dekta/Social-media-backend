const express = require("express")
const bcrypt  = require("bcrypt")
const jwt =  require("jsonwebtoken")
const mongoose = require("mongoose")
require('dotenv').config()
const cookieParser =  require("cookie-parser")
const cors = require('cors')

const {UserModel}=  require("../models/user.model")

const userRouter = express.Router()
userRouter.use(express.json())
userRouter.use(cookieParser())
userRouter.use(cors())


//register 
userRouter.post('/register',async(req,res)=>{
    const _id =  new mongoose.Types.ObjectId()
    const { name,email,password,dob,bio} = req.body;
    const user =  await UserModel.findOne({email})
    try{
        if(!user){
            bcrypt.hash(password,6, async function(err,hash){
                if(err){
                    res.send({"msg":"server side error"})
                }
                const user = new UserModel({_id,name,email,password:hash,dob,bio})
                await user.save()
                res.status(201).send({"msg":"signup done"})
            })
        }
        else{
            res.status(201).send({"msg":"user already exits"})
        }
        
    }
    catch(err){
        res.send(err)
    }
    
})


//login end-point
userRouter.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const user =  await UserModel.findOne({email})
    const hash = user?.password
    try{
        if(user.email){
            bcrypt.compare(password, hash, function(err, result) {
                if(result){
                    const token = jwt.sign({ email,id:user._id }, process.env.LOGIN ,{ expiresIn: 60000 });
                    res.cookie("token",token,{httpOnly:true})
                    res.status(201).send({"msg":"login successfully","token":token})
                }
                else{
                    res.status(401).send("invalid email and password")
                }
            });
        }
    }
    catch(err){
        res.send(err)
    }
    
})


//get all users
userRouter.get("/users",async(req,res)=>{
    try{
        let users = await UserModel.find()
        res.status(200).send(users)

    }
    catch(err){
        res.status(500).send({'Server error':err});
    }
})


//get friends of usrs
userRouter.get("/users/:id/friends",async(req,res)=>{
    let {id} = req.params
    try{
        const user = await UserModel.findById(id).populate('friends');
        if (!user) {
            res.status(404).send({ msg: 'User not found' });
        }
        res.status(200).send({"friends":user.friends});
    }
    catch(err){
        res.status(500).send({'Server error':err});
    }
})


//sent friend request
userRouter.post('/users/:id/friends', async (req, res) => {
    const { id } = req.params;
    const friendId = new mongoose.Types.ObjectId()
    try {
      const user = await UserModel.findById(id);
  
      if (!user) {
        return res.status(404).send({ "msg": 'User not found' });
      }
  
      if (user.friends.includes(friendId)) {
        return res.status(400).send({ "msg": 'Already friends' });
      }
      //console.log(friendId)
      user.friendRequests.push(friendId)
      await user.save();
      res.status(201).send({ "msg": 'Friend request sent' });
    } 
    catch (err) {
        res.status(500).send({'Server error':err});
    }
  });


//friend request accept or rejected
  userRouter.patch('/users/:id/friends/:friendId', async (req, res) => {
    const { id } = req.params;
    const {friendId} = req.params
    const {response} = req.body
    
    try {
      const user = await UserModel.findById(id);
  
      if (!user) {
        return res.status(404).send({ "msg": 'User not found' });
      }
  
      if(response=="Accept"){
          user.friends.push(friendId)
          await user.save();
          res.status(204).send({ "msg": 'friend request accepted' });
      }
      else{
        res.status(204).send({ "msg": 'friend request rejected' });
      }

    } 
    catch (err) {
        res.status(500).send({'Server error':err});
    }
  });




module.exports = {userRouter}
