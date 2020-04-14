
var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user')

// router.post('/register', function (req, res) {
//     let username = req.body.username
//     var newUser = new User({
//         username: req.body.username,
//         fullName: req.body.fullName,
//         avatar: req.body.avatar,
//         email: req.body.email,
//     })
//     User.register(newUser, req.body.password, function (err, user) {
//         if (err) {
//             console.log('error creating user ' + username + ' :' + err)
//             return res.render('register', { "error": err.message })
//         }
//         passport.authenticate('local')(req, res, function () {
//             req.flash("success", "Welcome to YelpCamp " + user.username)
//             res.redirect('/campgrounds')
//         })
//     })
// })


// Log In
router.post('/login',
    passport.authenticate('local'),
    function (req, res) {
        res.json({
            id: req.user.id,
            username: req.user.username,
            fullname: req.user.fullName
        })
    }
)

// Log out
router.get('/logout', function (req, res) {
    req.logout()
})

router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        const {id, username, fullname} = req.user;
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
