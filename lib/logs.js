const winston = require('winston');
const { format, transports } = winston;

winston.configure({
    format: format.combine(
        format.timestamp(),
        format.simple()
    ),
    transports: [
        new transports.Console({
            level: 'warn',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new transports.File({
             filename: 'yelpcamp.log',
             level: 'info'
        })
    ]
})
