const mongoose = require('mongoose')
const {Schema} = mongoose

const User = require('./user.js')



const commentSchema = new Schema({
 
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    userName:{
        type:String,
        require:true
    },
    contents:{
        type:String,
        require:true
    },
},{timestamps:true})

const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment

