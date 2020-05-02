
var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

router.post('/register', (req, res, next) => {
    const username = req.body.username
    const newUser = new User({
        username: req.body.username,
        fullName: req.body.fullName,
        avatar: req.body.avatar,
        email: req.body.email,
    })
    User.register(newUser, req.body.password)
        .then(user => {
            passport.authenticate('local')(req, res, () => {
                res.json(user.forREST())
            })
        })
        .catch(next);
})


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
    console.log('check user')
    console.log('authenticated? ', req.isAuthenticated())
    if (req.isAuthenticated()) {
        console.log('return ', req.user.forREST())
        res.json(req.user.forREST());
    } else {
        res.status(401).end();
    }
});

module.exports = router
