
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    campgroundRoutes = require('./rest-campgrounds'),
    authRoutes = require('./rest-auth'),
    commentsRoutes = require('./rest-comments');
const userRoutes = require('./rest-users');
const { ServerError } = require('./errors');

router.use('/auth', authRoutes);
router.use('/campgrounds', campgroundRoutes);
router.use('/campgrounds/:camp_id/comments', commentsRoutes);
router.use('/users', userRoutes);

const logErrors = (err, req, res, next) => {
    console.error('Request error ' + err.stack);
    next(err);
}

const resultErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    if (err instanceof mongoose.Error.CastError) {
        statusCode = 422;
    }
    if (err instanceof ServerError) {
        statusCode = err.statusCode;
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
