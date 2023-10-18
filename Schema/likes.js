const mongoose = require('mongoose')

const {Schema} = mongoose

const Post = require('./posts.js')
const User = require('./user.js')



const likeSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        require:true
    },
    userName:{
        type:String,
        require:true
    },
    isLike:{
        type:Boolean,
        require:false
    }
},{timestamps:true})

likeSchema.pre('deleteOne', async function(next){

})

const Like = mongoose.model('Like',likeSchema)

module.exports = Like