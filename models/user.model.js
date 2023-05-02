const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = mongoose.Schema( {
    _id: Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    dob: Date,
    bio: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    friends: [{type: Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

const UserModel = mongoose.model("User",userSchema)


module.exports = {UserModel}