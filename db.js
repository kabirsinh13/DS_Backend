const mongoose = require('mongoose')
const connection = async function (){
   await mongoose.connect('mongodb://127.0.0.1:27017/DestiShare');
   console.log("connected");
}


module.exports = {connection}