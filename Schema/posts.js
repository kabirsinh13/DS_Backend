const mongoose = require('mongoose')
const User = require('./user.js')
const {Schema} = mongoose

const postSchema = new Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    commentsBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            require:false
        }
    ],
    likedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            require:false
        }
    ]

})

const Post = mongoose.model('Post',postSchema)

module.exports = Post