/**
 * GENERIC NODEJS API
 * ************************************
 * 
 * modules: express, mysql, cors, dotenv, nodemon, sha1
 * 
 * REST API endpoints:
 * 
 * CRUD operations for generic db table
 * 
 * READ operations
 * GET /api/:table - Retrieve all records from spec table
 * GET /api/:table/:id - Retrieve spec record from spec table
 * 
 * 
 * CREATE operations
 * POST /api/:table - Create new record in spec table
 * 
 * 
 * UPDATE operations:
 * PATCH /api/:table/:id - Update spec record from spec table
 * 
 * 
 * DELETE operations
 * DELETE /api/:table - Delete all records from  spec table
 * DELETE /api/:table/:id - Delete a spec record from a spec table
 * 
 * 
 * EMAIL operations:
 * POST /api/email - Send an email using spec params
 * 
 * 
 * FILE operations /api/upload - Upload a file to the server
 * GET /api/download/:filename - Download a file from the server by filename. Possible post method
 * 
 * 
 * 
 * Middleware:
 * 
 * CORS - Cross-Origin Resource Sharing for all routes
 * Express JSON Parser - Parse incoming request bodies in JSON format
 * Express URL extended Parser - Parse incoming request bodies with URL-encoded data
 * Token Authentication - Verify the presence abd validity of a token in the request headers for protected routes (JWT)
 * 
 * 
 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const tableRoutes = require('./modules/table_ops')
const emailRoutes = require('./modules/email_ops')
const fileRoutes = require('./modules/file_ops')
const authRoutes = require('./modules/auth_ops')
const app = express()

//Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send('Welcome to the Generic NodeJS API')
})

//Routes
app.use('/table', tableRoutes)
app.use('/email', emailRoutes)
app.use('/file', fileRoutes)
app.use('/auth', authRoutes)


app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.APP_PORT}`)
});