const mongoose = require("mongoose")
const {Schema} = mongoose
const postSchema = mongoose.Schema( {
_id: Schema.Types.ObjectId,
  user: {type: String, ref: 'User' },
  text: String,
  image: String,
  createdAt: Date,
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: Date
  }]
})

const PostModel = mongoose.model("Post",postSchema)


module.exports = {PostModel}