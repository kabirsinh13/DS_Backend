const User = require('../Schema/user.js');
const jwt = require('jsonwebtoken')
require('dotenv').config()



const auth = async(req,res,next) =>{
    try{
        const getToken = req.headers.authorization.replace('Bearer','').trim();
        const payload = jwt.verify(getToken,process.env.JWT_KEY);
        if(!payload)
            throw new Error()
        const user = await User.findById(payload._id);
        req.user = user;
        req.token = getToken;
        next();
    }
    catch(e){
        res.status(401).send("please authenticate")
    }
   
}

module.exports = auth;