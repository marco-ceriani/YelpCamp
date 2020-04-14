
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
                res.json({
                    id: user.id,
                    username: user.username,
                    fullname: user.fullName,
                    avatar: user.avatar
                })
            })
        })
        .catch(next);
})


// Log In
router.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            fullname: req.user.fullName,
            avatar: req.user.avatar
        })
    }
)

// Log out
router.get('/logout', function (req, res) {
    req.logout()
})

router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        const { id, username, fullname } = req.user;
        res.json({
            id: req.user.id,
            username: req.user.username,
            fullname: req.user.fullName,
            avatar: req.user.avatar
        })
    } else {
        res.status(401)
    }
});

module.exports = router
