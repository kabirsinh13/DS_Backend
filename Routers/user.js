const express = require('express')

const router = express.Router()

const cors = require('cors')
const User = require('../Schema/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Like = require('../Schema/likes.js')
const multer = require('multer')
const auth = require('../auth/auth.js')

const upload = multer()
router.use(cors())

router.post('/user/signup',async (req,res)=>{
    const user = new User({...req.body})
    const response =  await user.save()
    const token = jwt.sign({_id:response._id.toString()},process.env.JWT_KEY,{expiresIn:'60 minutes'})
    response.tokens = response.tokens.concat({token});
    await response.save()
    res.send(response)
})

router.post('/user/login',async (req,res)=>{
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
       const token = jwt.sign({_id:user._id.toString()},process.env.JWT_KEY,{expiresIn:'60 minutes'})

       //Storing token in database
       user.tokens = user.tokens.concat({token});
       await user.save();


       res.send({user,token})
   }
   else{
       res.status(401).send("wrong password");
   }

router.post('/user/logout',auth,async (req,res)=>{
    try{
        
        const user = await User.findById(req.user._id)
        
        if(!user)
           throw new Error();
        user.tokens = user.tokens.filter((token)=>{
                return token.token !== req.token
        })
        await user.save();
        res.status(200).send("Logout successfully");
    }
    catch(e){
        res.status(401).send("Logout Failed")
    }
   })
})

router.get('/user/likedpost',auth,async (req,res)=>{
    //it will return all like collection which were liked by this user
    const userLiked = await Like.find({userId:req.user._id}).populate('postId')
    res.send(userLiked)
 })

 router.post('/user/updateuser', auth,upload.single('profilePic'), async (req,res)=>{
    
    const response = await User.findByIdAndUpdate({_id:req.user._id},{
        $set:{
            name : req.body.name,
            age : req.body.age,
            profilePic : req.file
        }
    })
    res.send()
 })


module.exports = router