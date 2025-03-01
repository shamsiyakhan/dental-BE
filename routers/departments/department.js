console.warn("department")
const conn = require('../../database/db.js')
const app = require('../../express-api/express.js')
const uuid4 = require('uuid4');


app.post('/add-department' , (req , res)=>{
    addDepartment(req, res)
})

app.get('/get-departments' , (req , res)=>{
    const sql="select * from department"
    conn.query(sql , (err , result)=>{
        if(err){
            res.status(400).send({error:err})
        }
        if(result){
            res.status(200).send({msg:result})
        }
    })
})

app.put('/update-department' , (req , res)=>{
    const sql="update department set dept_name=? where dept_id=?"
    conn.query(sql ,[req.body.dept_name , req.body.dept_id] ,  (err , result)=>{
        if(err){
            res.status(400).send({error:err})
        }
        if(result){
            res.status(200).send({msg:"Updated Successfully"})
        }
    })
})



function addDepartment(req , res){
    const id = generateUniqueId()
    sql = "select * from department where dept_id = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        } else {
            if (result.length > 0) {
                addDepartment(req, res)
            }
            else {
                    const insertSql = 'insert into department (dept_id , dept_name  ) values (?,?)'
                    conn.query(insertSql, [id, req.body.dept_name], (error, result2) => {
                        if (error) {
                            res.status(400).send({ error: error })
                        }
                        if (result2) {
                            res.status(200).send({ msg: "Department Added" })
                        }
                    })
                


            }
        }
    })
}


function generateUniqueId() {
    const uniqueId = uuid4().replace(/-/g, '').substring(0, 20);
    return uniqueId;
}