console.warn("login")
const conn = require('../database/db.js')
const app = require('../express-api/express.js')
const uuid4 = require('uuid4');
const bcrypt = require('bcrypt')


app.post('/admin-login' , (req , res)=>{
    const sql="select * from admindetails where username=?"
    console.warn(req.body.username)
    console.warn(req.body.password)
    conn.query(sql , [req.body.username] , (err , result)=>{
        if(err){
            res.status(401).send({error:err})
        }
        if(!result.length>0){
            res.status(401).send({error:"Invalid Credentials"})
        }else if(result){
            const isMatched=bcrypt.compare(req.body.password , result[0].password)
            if(isMatched){
                res.status(200).send({msg:result[0]})
            }
        }
    })
})


app.post('/login' , (req , res)=>{
    const sql="select * from staff where email=?"
    console.warn(req.body.username)
    console.warn(req.body.password)
    conn.query(sql , [req.body.email] , (err , result)=>{
        if(err){
            res.status(401).send({error:err})
        }
        if(!result.length>0){
            res.status(401).send({error:"Invalid Credentials"})
        }else if(result){
            const isMatched=bcrypt.compare(req.body.password , result[0].password)
            if(isMatched){
                res.status(200).send({msg:result[0]})
            }
        }
    })
})

