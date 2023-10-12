

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const cors = require('cors')
require('dotenv').config()
const {connection} = require('./db.js')


const User = require('./Schema/user.js')
const Post = require('./Schema/posts.js')

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

app.post('/createuser',async (req,res)=>{
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
app.post('/mypost',(req,res)=>{
    res.send("this is your post")
})

connection().then(
    ()=>{
        app.listen(3000,()=>{
        console.log("server listening on http://localhost:3000")
})
})