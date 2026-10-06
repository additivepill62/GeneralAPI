const express = require('express')
const router = express.Router()
var db = require('../utils/database.js')
router.get('/:table', (req, res) => {
    var table = req.params.table

    db.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            res.status(500).json({ error: '[GETAllRecordsError] Database query error' })
        } else {
            res.status(200).json(results)
        }
    })
})


router.get('/:table/:id', (req, res) => {
    var table = req.params.table
    var id = req.params.id

    db.query(`SELECT * FROM ${table} WHERE ID = ?`, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: '[GETSpecRecordError] Database query error '})
        } else {
            return res.status(200).json(results)
        }
    })

})

router.get('/:table/:field/:value',(req, res)=>{
    let table = req.params.table
    let field = req.params.field
    let value = req.params.value

    db.query(`SELECT * FROM ${table} WHERE ${field} = ?`, [value], (err, results)=>{
        if(err){
            return res.status(500).json({error: '[GETRecordsByFieldError] Database query error ' +err})
        } else{
            return res.status(200).json(results)
        }
    })
})

router.get('/:table/:field/:operator/:value', (req, res) => {
    let table = req.params.table;
    let field = req.params.field;
    let operator = req.params.operator;
    let value = req.params.value;

    let op = getOps(operator);
    if (!op) {
        return res.status(400).json({ error: 'Invalid operator' });
    }

    db.query(`SELECT * FROM ${table} WHERE ${field} ${op} ?`, [value], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error: ' + err.message });
        } else {
            return res.status(200).json(results);
        }
    })
});

router.post('/:table', (req, res) => {
    let table = req.params.table
    let data = req.body

    let fields = Object.keys(data).join(', ')
    let values = "'"+Object.values(data).join("', '")+"'"
    db.query(`INSERT INTO ${table} (${fields}) VALUES (${values})`, (err, results)=>{
        if(err){
            return res.status(500).json({error: '[INSERTIntoTableError] Database query error ' +err     })
        } else{
            return res.status(201).json({message: '[INSERTIntoTableSuccess] Record added sucessfully', id: results.insertId})
        }

    })
})

router.patch('/:table/:id', (req, res) => {
    let table = req.params.table
    let id = req.params.id
    let data = req.body

    let updates = Object.entries(data).map(([key, value]) => `${key} = '${value}'`).join(', ')
    
    db.query(`UPDATE ${table} SET ${updates} WHERE ID = ?`, [id], (err, results) => {
        if(err){
            return res.status(500).json({error: '[UPDATERecordError] Database query error ' +err})
        } else{
            return res.status(200).json({message: '[UPDATERecordSuccess] Record updated successfully'})
        }
    })
})

router.delete('/:table', (req, res) => {
    let table = req.params.table

    db.query(`DELETE FROM ${table}`, (err, results) => {
        if(err){
            return res.status(500).json({error: '[DELETEAllRecordsError] Database query error ' +err})
        } else{
            return res.status(200).json({message: '[DELETEAllRecordsSuccess] All records deleted successfully'})
        }
    })


})

router.delete('/:table/:id', (req, res) => {
    let table = req.params.table
    let id = req.params.id

    db.query(`DELETE FROM ${table} WHERE ID = ?`, [id], (err, results) => {
        if(err){
            return res.status(500).json({error: '[DELETERecordError] Database query error ' +err})
        } else{
            return res.status(200).json({message: '[DELETERecordSuccess] Record deleted successfully'})
        }
    })
})


function getOps(op) {
    switch (op) {
        case 'eq':
            return '=';
        case 'lt':
            return '<';
        case 'gt':
            return '>';
        case 'lte':
            return ' <= ';
        case 'gte':
            return ' >= ';
        case 'ne':
            return '!=';
        case 'like':
            return 'LIKE';
        case 'not':
            return 'NOT';
        default:
            throw new Error('Invalid operator');
    }
}


module.exports = router