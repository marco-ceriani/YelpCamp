
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    campgroundRoutes = require('./rest-campgrounds'),
    authRoutes = require('./rest-auth');

router.use('/auth', authRoutes);
router.use('/campgrounds', campgroundRoutes);

const logErrors = (err, req, res, next) => {
    console.error('Request error ' + err.stack);
    next(err);
}

const resultErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    if (err instanceof mongoose.Error.CastError) {
        statusCode = 422;
    }
    res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || 'unknown error'
    });
    next(err);
}

router.use(logErrors);
router.use(resultErrorHandler);

module.exports = router