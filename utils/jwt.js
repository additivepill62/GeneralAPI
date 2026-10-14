var jwt = require('jsonwebtoken')


function generateToken(payload) {
    const signOption={
        expiresIn:process.env.JWT_EXPIRES_IN
    }
    return jwt.sign(payload, process.env.JWT_SECRET,signOption)
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET,)
}




module.exports = {
    generateToken,
    verifyToken
}