const bodyParser = require('body-parser')
const express=require('express')
const cors=require('cors')
const app=express()
app.use(cors())

app.use(bodyParser.json())

app.listen(3000 , (err)=>{
    if(err){
        console.error(err)
    }else{
        console.warn("server listening to port 3000")
    }
})

module.exports=app