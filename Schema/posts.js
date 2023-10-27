const mongoose = require('mongoose')
const User = require('./user.js')
const {Schema} = mongoose

const Comment = require('./comments.js')
const Like = require('./likes.js')

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
    file:[
        {
            type:Object,
            require:true
        }
    ],
    commentsBy:[
        {
            comments:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Comment'
            },
            
        }
    ],

    likedBy:[
        {
            likes:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Like'
            }
        }
    ],

    viewedBy:[
        {
            views:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'View'
            }
        }
    ],

    commentCount:{
        type:Number
    },
    likeCount:{
        type:Number
    }

},{toObject:{virtuals:true}},{toJSON:{virtuals:true}})

// postSchema.virtual('commentsBy',{
//     ref:'Comment',
//     localField:'_id',
//     foreignField:'postId'

// })

// postSchema.virtual('likedBy',{
//     ref:'Like',
//     localField:'_id',
//     foreignField:'postId'
// })

const Post = mongoose.model('Post',postSchema)


module.exports = Post