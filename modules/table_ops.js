const express = require('express')
const router = express.Router()
var db = require('../utils/database.js')

// Get all records from a table
router.get('/:table', (req, res) => {
    var table = req.params.table

    db.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            res.status(500).json({ error: '[GETAllRecordsError] Database query error ' + err.message })
        } else {
            res.status(200).json(results)
        }
    })
})

// Get a specific record by ID
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
// Get records by field
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
// Get records by field and operator
router.get('/:table/:field/:operator/:value', (req, res) => {
    let table = req.params.table;
    let field = req.params.field;
    let operator = req.params.operator;
    let value = req.params.value;
    if (operator === 'LIKE' || operator === 'NOT LIKE') {
        value = '%'+value+'%';
    }

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
// Insert a new record into a table
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
// Update records by ID
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



// Update records by field
router.patch('/:table/:field/:value',(req, res)=>{
    let table = req.params.table
    let field = req.params.field
    let value = req.params.value
    let data = req.body

    let updates = Object.entries(data).map(([key, value]) => `${key} = '${value}'`).join(', ')

    db.query(`UPDATE ${table} SET ${updates} WHERE ${field} = ?`, [value], (err, results)=>{
        if(err){
            return res.status(500).json({error: '[UPDATERecordsByFieldError] Database query error ' +err.message})
        } else{
            return res.status(200).json({message: '[UPDATERecordsByFieldSuccess] Records updated successfully'})
        }
    })
})

// Update records by field and operator
router.patch('/:table/:field/:operator/:value',(req, res)=>{
    let table = req.params.table
    let field = req.params.field
    let operator = getOps(req.params.operator)
    let value = req.params.value
    let data = req.body
    if (operator === 'LIKE' || operator === 'NOT LIKE') {
        value = '%'+req.params.value+'%';
    }
    let updates = Object.entries(data).map(([key, value]) => `${key} = '${value}'`).join(', ')

    db.query(`UPDATE ${table} SET ${updates} WHERE ${field} ${operator} ?`, [value], (err, results)=>{
        if(err){
            return res.status(500).json({error: '[UPDATERecordsByFieldError] Database query error ' +err.message})
        } else{
            return res.status(200).json({message: '[UPDATERecordsByFieldSuccess] Records updated successfully'})
        }
    })
})









// Delete all records from a table
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
// Delete a specific record by ID
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

// Delete records by field
router.delete('/:table/:field/:value',(req, res)=>{
    let table = req.params.table
    let field = req.params.field
    let value = req.params.value

    db.query(`DELETE FROM ${table} WHERE ${field} = ?`, [value], (err, results)=>{
        if(err){
            return res.status(500).json({error: '[DELETERecordsByFieldError] Database query error ' +err})
        } else{
            return res.status(200).json({message: '[DELETERecordsByFieldSuccess] Records deleted successfully'})
        }
    })
})
// Delete records by field and operator
router.delete('/:table/:field/:operator/:value', (req, res) => {
    let table = req.params.table
    let field = req.params.field
    let operator = getOps(req.params.operator)
    let value = req.params.value
    if (operator === 'LIKE' || operator === 'NOT LIKE') {
        value = '%'+req.params.value+'%';
    }

    if (!operator) {
        return res.status(400).json({ error: 'Invalid operator' });
    }

    db.query(`DELETE FROM ${table} WHERE ${field} ${operator} ?`, [value], (err, results) => {
        if (err) {
            return res.status(500).json({ error: '[DELETERecordsByOperatorError] Database query error: ' + err.message });
        } else {
            return res.status(200).json({ message: '[DELETERecordsByOperatorSuccess] Records deleted successfully' });
        }
    })
});

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
        case 'LK':
            return 'LIKE';
        case 'nlk':
            return 'NOT LIKE';
        case 'nt':
            return 'NOT';
        default:
            throw new Error('Invalid operator');
    }
}


module.exports = router