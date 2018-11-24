
var express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user'),
    Campground = require('../models/campground')

router.get('/', function(req, res){
    res.render('landing')
})


// Authentication routes

router.get('/register', function(req, res) {
    res.render('register', {page: 'register'})
})

router.post('/register', function(req, res){
    let username = req.body.username
    var newUser = new User({
        username: req.body.username,
        fullName: req.body.fullName,
        avatar: req.body.avatar,
        email: req.body.email,
    })
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

// User profile
router.get('/users/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            req.flash('error', 'User not found')
            return res.redirect('back')
        }
        Campground.find().where('author.id').equals(user._id).exec(function(err, campgrounds) {
            if (err) {
                console.log('cannot load campgrounds for user ' + user._id + ' profile')
                res.render('users/show', {user: user, campgrounds: []})
            } else {
                res.render('users/show', {user: user, campgrounds: campgrounds})
            }
        })
    })
})

module.exports = router
