const mongoose = require('mongoose')
const {Schema} = mongoose
const Post = require('./posts.js')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        validate(value){
            return value!==null
        }
    },
    password:{
        type:String,
        trim:true,
        minLength:7,
        validate(value){
          return value!=='password'  || value!==null
        }
    },
    age:{
        type:Number,
        require:true,
    },
    postCount:{
        type:Number,
        require:false
    },
    tokens:[{
          token: {
            type:String,
            require:true,
            default:"token"
        }
        }  
    ]
})

userSchema.virtual('posts',{
    ref:'Post',
    localField:'_id',
    foreignField:'postedBy'
})

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password'))
    user.password = await bcrypt.hash(user.password,10);
    next();
})

const User = mongoose.model('User',userSchema)

module.exports = User

