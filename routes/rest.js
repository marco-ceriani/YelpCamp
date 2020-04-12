
var express    = require('express'),
    router     = express.Router(),
    campgroundRoutes = require('./rest-campgrounds');

router.use('/campgrounds', campgroundRoutes);

module.exports = router
