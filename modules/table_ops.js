const express = require('express')
const router = express.Router()
var db = require('../utils/database.js')
router.get('/:table', (req, res) => {
    var table = req.params.table

    db.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query error' })
        } else {
            res.json(results)
        }
    })
})

router.get('/:table', (req, res) => {})
router.get('/:table/:id', (req, res) => {})
router.post('/:table', (req, res) => {})
router.patch('/:table/:id', (req, res) => {})
router.delete('/:table', (req, res) => {})
router.delete('/:table/:id', (req, res) => {})


module.exports = router