

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const cors = require('cors')
require('dotenv').config()
const {connection} = require('./db.js')


const User = require('./Schema/user.js')
const Post = require('./Schema/posts.js')
const Comment = require('./Schema/comments.js')
const Like = require('./Schema/likes.js')

const bodyParser = require('body-parser')




const app = express()
const upload = multer()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())


app.get('/',(req,res)=>{
    // console.log(process.env.JWT_KEY)
    res.send("hello")
})

app.post('/user/signup',async (req,res)=>{
     const user = new User({...req.body})
     const response =  await user.save()
     const token = jwt.sign({_id:response._id.toString()},process.env.JWT_KEY,{expiresIn:'7 days'})
     response.tokens = response.tokens.concat({token});
     await response.save()
     res.send(response)
})

app.post('/user/login',async (req,res)=>{
    //Finding user in Database by email
    // console.log(req.body.email,req.body.password)
    const user =await User.findOne({email:req.body.email})
    
    //User not found in Database
    if(!user){
        return res.status(404).send("User not found")
    }

    //compare password entered by user with password stored in database
    const isMatch = await bcrypt.compare(req.body.password,user.password);

    //checking for password match or not
    if(isMatch){

        //generating token for logged in user
        const token = jwt.sign({_id:user._id.toString()},process.env.JWT_KEY,{expiresIn:'7 days'})

        //Storing token in database
        user.tokens = user.tokens.concat({token});
        await user.save();


        res.send({user,token})
    }
    else{
        res.status(401).send("wrong password");
    }
})

app.post('/createpost',upload.array('photos',12),async (req,res)=>{
         const newPost = new Post({
            ...req.body,
            file:req.files
         })

         await newPost.save()
         res.send()
})

//it will send user post from backend to frontend after recieving user id from frontend
//authenticated route
app.post('/mypost',async (req,res)=>{
    const userId = req.body.id;
    const result = await Post.find({postedBy:userId})

    res.send(result)
})

app.get("/allpost",async (req,res)=>{
    const posts = await Post.find({})
    res.send(posts)
})

app.post('/postbyid',async (req,res)=>{
    const post = await Post.findById({_id:req.body.id}).populate('postedBy','name').populate('commentsBy.comments').exec()
    res.send(post)
})

app.post('/postcomment',async (req,res)=>{
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

app.post('/likepost',async (req,res)=>{
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
    res.send("liked successfully")
})

app.post('/unlikepost',async (req,res)=>{
    const userid = req.body.userid
    const like = await Like.findOne({$and:[{userId:userid},{postId:req.body.postid}]})
    await Like.deleteOne({_id:like._id})
    await Post.updateOne({_id:req.body.postid},{$pull:{likedBy:{likes:like._id}}})
    res.send("unliked successfully")
})
app.post('/getLike',async (req,res)=>{
    const like = await Like.findOne({$and:[{userId:req.body.userid},{postId:req.body.postid}]})
    if(like!==null)
    res.send(like.isLike);
    else
    res.send(false)
})
connection().then(
    ()=>{
        app.listen(3000,()=>{
        console.log("server listening on http://localhost:3000")
})
})