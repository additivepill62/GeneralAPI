const winston = require('winston');


const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),//color out
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),//add timestamp
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`//custom log msg foramt
        })
    ),
    transports: [
        new winston.transports.Console(),//log to console
        new winston.transports.File({ filename: 'server.log' }),//log to file
    ],
});

module.exports = logger