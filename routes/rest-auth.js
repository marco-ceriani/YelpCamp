
var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

const convertUser = (user) => {
    return {
        id: user.id,
        username: user.username,
        fullname: user.fullName,
        avatar: user.avatar
    }
}

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
                res.json(convertUser(user))
            })
        })
        .catch(next);
})


// Log In
router.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        res.json(convertUser(req.user))
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
        res.json(convertUser(req.user));
    } else {
        res.status(401)
    }
});

module.exports = router
