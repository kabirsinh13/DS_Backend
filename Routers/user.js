const express = require('express')

const router = express.Router()

const cors = require('cors')
const User = require('../Schema/user.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const auth = require('../auth/auth.js')

router.use(cors())

router.post('/user/signup',async (req,res)=>{
    const user = new User({...req.body})
    const response =  await user.save()
    const token = jwt.sign({_id:response._id.toString()},process.env.JWT_KEY,{expiresIn:'6 minutes'})
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
       const token = jwt.sign({_id:user._id.toString()},process.env.JWT_KEY,{expiresIn:'5 minutes'})

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


module.exports = router