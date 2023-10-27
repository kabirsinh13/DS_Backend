const mongoose = require('mongoose')

const User = require('../Schema/user.js')
const {Schema} = mongoose


const viewSchema = new Schema({
    viewedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        require:true,
    },
    isViewed:{
        type:Boolean,
        default:false
    }

})


const View = mongoose.model('View',viewSchema)
module.exports = View