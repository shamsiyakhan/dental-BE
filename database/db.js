const mysql=require('mysql')

const conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"demo_dental"
})

conn.connect((err)=>{
    if(err){
        console.error("Database connection failed" , err)
    }else{
        console.warn("Database Connected Sucessfully")
    }
})

module.exports=conn