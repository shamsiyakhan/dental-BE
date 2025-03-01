const conn = require('../../database/db.js')
const app = require('../../express-api/express.js')
const uuid4 = require('uuid4');

app.post('/add-invoice', (req, res) => {
    addInvoice(req, res)
});

app.post('/add-payment-information', (req, res) => {
    addPayments(req, res)
})

function addInvoice(req, res) {
    const id = generateUniqueId();
    const sql = "select * from invoice where invoice_id=?";
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        } else {
            if (result.length > 0) {
                addInvoice(req, res)
            } else {
                const insertSql = 'insert into invoice (invoice_id , invoice_date , status , treatmentId , patientId) values(?,?,?,?,?)'
                conn.query(insertSql, [id, req.body.invoice_date, req.body.status, req.body.treatmentId, req.body.patientId], (error, result2) => {
                    if (error) {
                        res.status(400).send({ error: error })
                    }
                    if (result2) {
                        addPaymentInformation(req, res, id)
                        // res.status(200).send({msg:"Invoice Added"})
                    }
                })
            }
        }
    })
}

function addPaymentInformation(req, res, invoiceId) {
    const id = generateUniqueId()
    const sql = "select * from payment where payment_id=?"
    conn.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        } else {
            if (result.length > 0) {
                addPaymentInformation(req, res)
            } else {
                const total_payment = req.body.total_payment;
                const discountPercent = req.body.discountPercent;
                var finalAmount;
                if (discountPercent > 0) {
                    finalAmount = total_payment - (total_payment * (discountPercent / 100));
                } else {
                    finalAmount = total_payment;
                }

                const pending_payment = finalAmount - req.body.paid;

                const insertSql = 'insert into payment (payment_id , total_payment , pending_payment , payment_date , payment_type , discountPercent , invoice_id , paid) values(?,?,?,?,?,?,?,?)'
                conn.query(insertSql, [id, finalAmount, pending_payment, req.body.payment_date, req.body.payment_type, req.body.discountPercent, invoiceId, req.body.paid], (error, result2) => {
                    if (error) {
                        res.status(400).send({ error: error })
                    }
                    if (result2) {
                        res.status(200).send({ msg: "Payment Information Added" })
                    }
                })
            }
        }
    })
}


function addPayments(req, res) {
    const invoiceId = req.body.invoiceId;
    const sql = "select * from payment where invoice_id=? order by payment_date desc"
    conn.query(sql, [invoiceId], (err, result) => {
        if (err) {
            res.status(400).send({ error: err })
        }
        if (result) {
            // res.status(200).send({msg:result[0]})
            const id = generateUniqueId();
            conn.query('select * from payment where payment_id=?', [id], (err, result2) => {
                if (err) {
                    res.status(400).send({ error: err })
                }
                if (result2) {
                    if (result2.length > 0) {
                        addPayments(req, res)
                    } else {
                        const total_payment = result[0].total_payment;
                        const discountPercent = result[0].discountPercent;
                        const pending_payment = result[0].pending_payment - req.body.paid;
                        const addPayment = 'insert into payment (payment_id , total_payment , pending_payment , payment_date , payment_type , discountPercent , invoice_id , paid) values(?,?,?,?,?,?,?,?)'
                        conn.query(addPayment, [id, total_payment, pending_payment, req.body.payment_date, req.body.payment_type, discountPercent, invoiceId, req.body.paid], (err, result) => {
                            if (err) {
                                res.status(400).send({ error: err })
                            }
                            if (result) {
                                res.status(200).send({ msg: "Payment Added" })
                            }
                        })

                    }
                }
            })

        }
    })
}





function generateUniqueId() {
    const uniqueId = uuid4().replace(/-/g, '').substring(0, 20);
    return uniqueId;
}