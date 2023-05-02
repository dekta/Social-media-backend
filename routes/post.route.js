const express = require("express")
const jwt = require("jsonwebtoken")
const mongoose  =require("mongoose")

const cors = require('cors')

const  {PostModel}=  require("../models/post.model")
const {authenticate} = require("../middlewares/authentication")

const postRouter = express.Router()
postRouter.use(express.json())

postRouter.use(cors())



//get all posts
postRouter.get("/posts",async(req,res)=>{
    try{
        let posts = await PostModel.find()
        res.status(200).send(posts)

    }
    catch(err){
        res.status(500).send({'Server error':err});
    }
})


//create post
postRouter.post('/posts',authenticate, async(req, res) => {
    const user = req.cookies?.userId
    //console.log("userid",user)
    const _id =  new mongoose.Types.ObjectId()
    const {text, image } = req.body;
    try {
        const newPost = new PostModel({_id,user,text,image,createdAt: new Date(),likes: [],comments: []});
       // console.log(newPost)
        await newPost.save();
        res.status(200).send({"msg":"post created"})
    } 
    catch (err) {
        res.status(500).send({'Server error':err});
    }
});



postRouter.patch('/posts/:id',authenticate, async(req, res) => {
    const {id} = req.params
    const {text, image } = req.body;
    try {
        data = {
            text,
            image
        }
        const filter = {_id:id}
        const update = data
        const newPost = await PostModel.findOneAndUpdate(filter,update)
        await newPost.save();
        res.status(204).send({"msg":"post updated"})
    } 
    catch (err) {
        res.status(500).send({'Server error':err});
    }
});



postRouter.delete('/posts/:id',authenticate, async(req, res) => {
    const {id} = req.params

    try {
        const newPost = await PostModel.findByIdAndDelete(id)
        await newPost.save();
        res.status(202).send({"msg":"post deleted"})
    } 
    catch (err) {
        res.status(500).send({'Server error':err});
    }
});


postRouter.post('/posts/:id/like', async(req, res) => {
    
    const {like} = req.body;
    try {
       
    } 
    catch (err) {
        res.status(500).send({'Server error':err});
    }
});







module.exports = {postRouter}
