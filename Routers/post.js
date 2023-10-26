const express = require('express')

const router = express.Router()

const Post = require('../Schema/posts.js')
const Comment = require('../Schema/comments.js')
const Like = require('../Schema/likes.js')
const User = require('../Schema/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const cors = require('cors')
const auth = require('../auth/auth.js')

router.use(cors())

const upload = multer()


router.post('/createpost',auth,upload.array('photos',12),async (req,res)=>{
    const newPost = new Post({
       ...req.body,
       file:req.files
    })

    await newPost.save()

    const response = await User.findOneAndUpdate(
      {_id:req.user._id},
      {$inc: {postCount: 1}})
    res.send()
})

//it will send user post from backend to frontend after recieving user id from frontend
//authenticated route
router.post('/mypost',auth,async (req,res)=>{
const userId = req.body.id;
const result = await Post.find({postedBy:userId})

res.send(result)
})

router.get("/allpost",async (req,res)=>{
const posts = await Post.find({})
res.send(posts)
})

router.post('/postbyid',auth,async (req,res)=>{
const post = await Post.findById({_id:req.body.id}).populate('postedBy','name').populate('commentsBy.comments').exec()
res.send(post)
})

router.post('/postcomment',auth,async (req,res)=>{
const newComment = new Comment({
   userId:req.body.userid,
   contents:req.body.contents,
   userName:req.body.userName
})

const response = await newComment.save()// get the comment collection reference 
const comments = response._id
const post = await Post.findById({_id:req.body.postid})
post.commentsBy = post.commentsBy.concat({comments})
await post.save()
   // await response.populate('userId','name')
res.send(response)

})

router.post('/likepost',auth,async (req,res)=>{
const newLiked = new Like({
    userId:req.body.userid,
    userName:req.body.userName,
    postId:req.body.postid,
    isLike:req.body.isLike
})
const response = await newLiked.save()
const likes = response._id
const post = await Post.findById({_id:req.body.postid})
post.likedBy = post.likedBy.concat({likes})
await post.save()
res.send("Liked successfully")
})

router.post('/unlikepost',auth,async (req,res)=>{
const userid = req.body.userid
const like = await Like.findOne({$and:[{userId:userid},{postId:req.body.postid}]})
await Like.deleteOne({_id:like._id})
await Post.updateOne({_id:req.body.postid},{$pull:{likedBy:{likes:like._id}}})
res.send("Unliked successfully")
})
router.post('/getLike',auth,async (req,res)=>{
const like = await Like.findOne({$and:[{userId:req.body.userid},{postId:req.body.postid}]})
if(like!==null)
res.send(like.isLike);
else
res.send(false)
})


module.exports = router
