import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    
  },
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 100
  },
  image: {
    type: String,
    default: 'https://png.pngtree.com/png-vector/20220610/ourmid/pngtree-letter-in-envelope-icon-png-image_4959987.png'
  },
  category: {
    type: String,
    default: 'uncategorized'
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema);

export default Post;