

const express = require('express')

const cors = require('cors')
const {connection} = require('./db.js')

const bodyParser = require('body-parser')

const postRouter = require('./Routers/post.js')
const userRouter = require('./Routers/user.js')




const app = express()


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/',postRouter)
app.use('/',userRouter)
app.use(cors())


app.get('/',(req,res)=>{
    // console.log(process.env.JWT_KEY)
    res.send("hello")
})

connection().then(
    ()=>{
        app.listen(3000,()=>{
        console.log("server listening on http://localhost:3000")
})
})