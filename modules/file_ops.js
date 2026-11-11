const express = require('express')
const router = express.Router()
const multer = require('multer')

const path =require('path')
const fs = require('fs') //filesystem module
const uploadDir = path.join(__dirname, '../uploads')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive:true})
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
         file.originalname = file.originalname.replace(/\s+/g, '-').toLowerCase()
         const name = path.parse(file.originalname).name
         const ext = path.extname(file.originalname)
         const timestamp = Date.now()
         const randomString = Math.random().toString(36).substring(2, 8)
         cb(null, `${name}_${timestamp}_${randomString}${ext}`)
    }
})
const upload = multer({ 
    storage: storage, 
    limits:{ 
        filesize: 10*1024*1024//10mb limit
    }, 
    fileTypes:['image/*'] // csak kepek
    
})

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }
    res.status(200).json({ 
        message: 'File uploaded successfully', 
        originalName: req.file.originalname,
        storedName: req.file.filename,
        size: req.file.size,
        path: req.file.path
    })
})


/*
router.get('/download/:filename', (req, res) => {
    res.download(`uploads/${req.params.filename}`)
})
*/

// ERROR HANDLING
router.use((err, req, res, next) => {
 
    // Multer errors
    if (err instanceof multer.MulterError) {
 
        // File too large
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                error: 'FILE_TOO_LARGE',
                message: 'Maximum file size is 5 MB'
            });
        }
 
        return res.status(400).json({
            error: err.code,
            message: err.message
        });
    }
 
    // Other upload errors
    if (err) {
        return res.status(400).json({
            error: 'UPLOAD_ERROR',
            message: err.message
        });
    }
 
    next();
});


module.exports = router