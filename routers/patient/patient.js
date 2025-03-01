const conn = require('../../database/db.js')
const app = require('../../express-api/express.js')
const uuid4 = require('uuid4');
const bcrypt = require('bcrypt')



app.post('/add-patient', (req, res) => {
    addPatient(req, res)
});

app.put('/update-patient', (req, res) => {
   
        const id = req.body.patientId;  
        
    
        const updateSql = `
            UPDATE patient 
            SET firstname = ?, middlename = ?, lastname = ?, 
                email = ?, phone_no = ?, emergency_contact_name = ?, 
                emergency_contact = ?, address = ?, dob = ?, 
                maritial_status = ?, gender = ?, age = ?
            WHERE patientId = ?`;
    
        conn.query(updateSql, [
            req.body.firstname, req.body.middlename, req.body.lastname,
            req.body.email, req.body.phone_no, req.body.emergency_contact_name,
            req.body.emergency_contact, req.body.address, req.body.dob,
            req.body.maritial_status, req.body.gender, req.body.age,
            id
        ], (error, result) => {
            if (error) {
                console.warn(error);
                return res.status(400).send({ error: error });
            }
            if (result.affectedRows > 0) {
                res.status(200).send({ msg: "Patient Updated Successfully" });
            } else {
                res.status(404).send({ msg: "Patient Not Found" });
            }
        });
    
    
})

app.delete('/delete-patient', (req, res) => {
    const id = req.body.patientId;
    const sql = "delete from patient where patientId = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        }
        if (result) {
            res.status(200).send({ msg: "Patient Deleted" })
        }
    })
})

app.get("/get-patients", (req, res) => {
    const sql = "select * from patient"
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        }
        if (result) {
            res.status(200).send({ msg: result })
        }
    })
})

function addPatient(req, res) {
    const id = generateUniqueId()
    const prn = generateUniqueId()
    sql = "select * from patient where patientId = ? and prn = ?"
    conn.query(sql, [id , prn], (err, result) => {
        if (err) {
            res.status(402).send({ error: err })
        } else {
            if (result.length > 0) {
                addPatient(req, res)
            }
            else {
                
                  
                   
                    const insertSql = 'insert into patient (patientId , prn , firstname , middlename , lastname , email , phone_no , emergency_contact_name  ,  emergency_contact , address , dob , maritial_status  , gender , age ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                    conn.query(insertSql, [id, prn, req.body.firstname, req.body.middlename, req.body.lastname, req.body.email, req.body.phone_no, req.body.emergency_contact_name, req.body.emergency_contact, req.body.address, req.body.dob, req.body.maritial_status, req.body.gender, req.body.age], (error, result2) => {
                        if (error) {
                            console.warn(error)
                            res.status(400).send({ error: error })
                        }
                        if (result2) {
                            res.status(200).send({ msg: "Patient Added" })
                            
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