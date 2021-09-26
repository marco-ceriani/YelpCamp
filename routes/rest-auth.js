
var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

// Log In
router.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        res.json(req.user.forREST())
    }
)

// Log out
router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.status(200).end();
})

router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user.forREST());
    } else {
        res.status(401).end();
    }
});

module.exports = router
