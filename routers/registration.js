const conn = require('../database/db.js')
const app = require('../express-api/express.js')
const uuid4 = require('uuid4');
const bcrypt = require('bcrypt')

app.post('/admin-registration', (req, res) => {
    addAdmin(req, res)
})


function addAdmin(req, res) {
    const id = generateUniqueId()
    sql = "select * from adminDetails where admin_id = ?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        } else {
            if (result.length > 0) {
                addAdmin(req, res)
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
                    const insertSql = 'insert into adminDetails (admin_id , fullname , username,password , address , gender , phone_no ) values (?,?,?,?,?,?,?)'
                    console.warn("hased password is", hashed)
                    conn.query(insertSql, [id, req.body.fullname, req.body.username, hashed, req.body.address, req.body.gender, req.body.phone_no], (error, result2) => {
                        if (error) {
                            res.status(400).send({ error: error })
                        }
                        if (result2) {
                            res.status(200).send({ msg: "Registration completed for Admin" })
                        }
                    })
                });


            }
        }
    })

}

function generateUniqueId() {
    const uniqueId = uuid4().replace(/-/g, '').substring(0, 20);
    return uniqueId;
}