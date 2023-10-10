const User = require('../../schema/users.js');
const jwt = require('jsonwebtoken')




const auth = async(req,res,next) =>{
    try{
        const getToken = req.headers.authorization.replace('Bearer','').trim();
        const payload = jwt.verify(getToken,process.env.JWTSECRET);
        const user = await User.findById(payload._id);
        // console.log(user)

        if(!payload)
            throw new Error()
        req.user = user;
        req.token = getToken;
        next();
    }
    catch(e){
        res.status(401).send("please authenticate")
    }
   
}

module.exports = auth;