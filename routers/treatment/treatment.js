const conn = require('../../database/db.js')
const app = require('../../express-api/express.js')
const uuid4 = require('uuid4');



app.post('/add-treatment', (req, res) => {
    addTreatment(req, res);
})

app.post("/diagnose-treatment" , (req , res)=>{
    addDiagnosis(req , res);
})

app.get("/get-treatments/:patientId", (req, res) => {
    const sql = "SELECT * FROM treatment WHERE patientId = ?";
    
    conn.query(sql, [req.params.patientId], async (err, result) => {
        if (err) {
            return res.status(400).send({ error: err });
        }

        if (result.length === 0) {
            return res.status(200).send({ msg: result });
        } else {
            try {
                const treatmentResult = await Promise.all(
                    result.map(async (treatment) => {
                        return new Promise((resolve, reject) => {
                            const deptSql = "SELECT * FROM department WHERE dept_id = ?";
                            conn.query(deptSql, [treatment.dept_id], (err, deptResult) => {
                                if (err) return reject(err);

                                treatment.department = deptResult.length > 0 ? deptResult[0] : null;
                                resolve(treatment);
                            });
                        });
                    })
                );

                res.status(200).send({ msg: treatmentResult });
            } catch (error) {
                res.status(500).send({ error: error });
            }
        }
    });
});

app.get("/getDiagnosis/:treatmentId" , (req , res)=>{
    const sql = "SELECT * FROM treatment_diagnosis WHERE treatmentId = ? order by diagnosis_date desc";
    conn.query(sql , [req.params.treatmentId] , async (err , result)=>{
        if(err){
            res.status(400).send({error:err})
        }
        if(result){
            // res.status(200).send({msg:result})
            const diagnosisResult = await Promise.all(result.map((diagnosis)=>{
                return new Promise((resolve , reject)=>{
                    const staffSql = "SELECT * FROM staff WHERE staffid = ?";
                    conn.query(staffSql , [diagnosis.staffid] , (err , staffResult)=>{
                        if(err) return reject(err);
                        diagnosis.staff = staffResult.length > 0 ? staffResult[0] : null;
                        resolve(diagnosis);
                    })
                })
            }))
            res.status(200).send({msg:diagnosisResult})
            
        }
    })
})



function addTreatment(req, res) {
    const id = generateUniqueId();
    const sql = "select * from treatment where treatmentId = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        } else {
            if (result.length > 0) {
                addTreatment(req, res)
            }
            else {
                const insertSql = 'insert into treatment (treatmentId , treatment_name , patient_history , findings , documents , start_date , treatment_status , patientId , dept_id) values (?,?,?  , ? , ? , ? , ? , ?)'
                conn.query(insertSql, [id, req.body.treatment_name, req.body.patient_history , req.body.findings , req.body.documents , req.body.start_date , req.body.treatment_status , req.body.patientId , req.body.dept_id ], (error, result2) => {
                    if (error) {
                        res.status(400).send({ error: error })
                    }
                    if (result2) {
                        res.status(200).send({ msg: "Treatment Added" })
                    }
                })
            }
        }
    })
}


function addDiagnosis(req, res) {
    const id = generateUniqueId();
    const sql = "select * from treatment_diagnosis where diagnosis_id = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        } else {
            if (result.length > 0) {
                addTreatment(req, res)
            }
            else {
                const insertSql = 'insert into treatment_diagnosis (diagnosis_id , diagnosis , diagnosis_date , next_appointment , staffid , treatmentId ) values (?,?,?  , ? , ? , ?)'
                conn.query(insertSql, [id, req.body.diagnosis, req.body.diagnosis_date , req.body.next_appointment , req.body.staffid , req.body.treatmentId ], (error, result2) => {
                    if (error) {
                        res.status(400).send({ error: error })
                    }
                    if (result2) {
                        res.status(200).send({ msg: "Diagnosis Added" })
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