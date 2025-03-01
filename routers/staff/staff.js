const conn = require('../../database/db.js')
const app = require('../../express-api/express.js')
const uuid4 = require('uuid4');
const bcrypt = require('bcrypt')


app.post('/add-staff', (req, res) => {
    console.warn("add staff called")
    addStaff(req, res)
})

app.get("/get-staff", (req, res) => {
    const sql = "select * from staff"
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        }
        if (result) {
            console.warn(result[0])
            res.status(200).send({ msg: result })
        }
    })

})

app.get("/get-staff-details", (req, res) => {
    const sql = "select * from staff where staffid=?"
    conn.query(sql, [req.body.staffid], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        }
        if (result) {
            res.status(200).send({ msg: result[0] })
        }
    })
})


app.delete("/delete-staff", (req, res) => {
    const sql = "delete from staff where staffid=?"
    conn.query(sql, [req.body.staffid], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        }
        if (result) {
            res.status(200).send({ msg: "Deleted Successfully" })
        }
    })
})


app.put('/update-staff', (req, res) => {
    updateStaff(req, res)
})

function updateStaff(req, res) {
    const staffId = req.body.staffid;

    const updateSql = `
        UPDATE staff 
        SET 
            password = ?, 
            phone_no = ?, 
            address = ?, 
            joiningDate = ?, 
            gender = ?, 
            age = ?, 
            maritial_status = ?, 
            emergency_contact = ?, 
            jobTitle = ?, 
            staffStatus = ?, 
            specialization = ?, 
            degree = ?, 
            certification = ?, 
            experience = ?, 
            registration_no = ?, 
            fullname=?,
            roleid = ?
        WHERE staffid = ?`;

    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.error("Error hashing password");
            res.status(500).send({ error: err });
            return;
        }

        const values = [
            hash,
            req.body.phone_no,
            req.body.address,
            req.body.joiningDate,
            req.body.gender,
            req.body.age,
            req.body.maritial_status,
            req.body.emergency_contact,
            req.body.jobTitle,
            req.body.staffStatus,
            req.body.specialization,
            req.body.degree,
            req.body.certification,
            req.body.experience,
            req.body.registration_no,
            req.body.roleid,
            req.body.fullname,
            staffId
        ];

        conn.query(updateSql, values, (error, result) => {
            if (error) {
                console.error(error);
                res.status(400).send({ error: error });
            } else {
                res.status(200).send({ msg: "Staff Updated Successfully" });
            }
        });
    });
}



function addStaff(req, res) {
    const id = generateUniqueId()
    sql = "select * from staff where staffid = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(402).send({ error: err })
        } else {
            if (result.length > 0) {
                addStaff(req, res)
            }
            else {
                const saltRounds = 10;
                var hashed;
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (err) {
                        console.error("error hashing password")
                    };
                    console.log('Password Hash:', hash);
                    hashed = hash
                    const insertSql = 'insert into staff (staffid , email , password , phone_no , address , joiningDate , gender , age , maritial_status ,  emergency_contact , jobTitle , staffStatus , specialization  , degree , certification , experience , registration_no , roleid , fullname  ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
                    conn.query(insertSql, [id, req.body.email, hashed, req.body.phone_no, req.body.address, req.body.joiningDate, req.body.gender, req.body.age, req.body.maritial_status, req.body.emergency_contact, req.body.jobTitle, req.body.staffStatus, req.body.specialization, req.body.degree, req.body.certification, req.body.experience, req.body.registration_no, req.body.roleid , req.body.fullname], (error, result2) => {
                        if (error) {
                            console.warn(error)
                            res.status(400).send({ error: error })
                        }
                        if (result2) {
                            //res.status(200).send({ msg: "Staff Added" })
                            addStaffToDepartment(req, res, id)
                        }
                    })
                })



            }
        }
    })
}

function addStaffToDepartment(req, res, staffid) {
    const id = generateUniqueId()
    sql = "select * from staff_departments where sdId = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(402).send({ error: err })
        } else {
            if (result.length > 0) {
                addStaffToDepartment(req, res, staffid)
            }
            else {
                const dept_id = req.body.dept_id
                if (typeof dept_id === "string") {
                    try {
                        dept_id = JSON.parse(dept_id); // Convert JSON string to an array
                    } catch (e) {
                        return res.status(400).send({ error: "Invalid dept_id format" });
                    }
                }
        
                if (!Array.isArray(dept_id)) {
                    return res.status(400).send({ error: "dept_id should be an array" });
                }

                console.warn("dept_id", dept_id)
                var result = "pass"
                const insertSql = 'insert into staff_departments (sdId ,staffid , dept_id ) values (?,?,?)'
                dept_id.forEach(element => {
                    
                    const unique=generateUniqueId()
                    conn.query(insertSql, [unique , staffid, element], (error, result2) => {
                        if (error) {
                            result="fail"
                            console.warn(error)
                            res.status(400).send({ error: error })
                        }
                    })
                });

                if(result=="pass"){
                    res.status(200).send({ msg: "Staff Added" })
                }
                
            }
        }
    }
)
}


            function generateUniqueId() {
                const uniqueId = uuid4().replace(/-/g, '').substring(0, 20);
                return uniqueId;
            }