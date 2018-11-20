
var express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user')

router.get('/', function(req, res){
    res.render('landing')
})


// Authentication routes

router.get('/register', function(req, res) {
    res.render('register', {page: 'register'})
})

router.post('/register', function(req, res){
    let username = req.body.username
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log('error creating user ' + username + ' :' + err)
            return res.render('register', {"error": err.message})
        }
        passport.authenticate('local')(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username)
            res.redirect('/campgrounds')
        })
    })
})

router.get('/login', function(req, res) {
    res.render('login', {page:'login'})
})

// Log In
router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }),
    function(req, res) {}
)

// Log out
router.get('/logout', function(req, res) {
    req.logout()
    req.flash("success", "Logged out!")
    res.redirect('/campgrounds')
}) 

module.exports = router
