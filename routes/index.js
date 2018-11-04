
var express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user')

router.get('/', function(req, res){
    res.render('landing')
})


// Authentication routes

router.get('/register', function(req, res) {
    res.render('register')
})

router.post('/register', function(req, res){
    let username = req.body.username
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log('error creating user ' + username + ' :' + err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('campgrounds')
        })
    })
})

router.get('/login', function(req, res) {
    res.render('login')
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
    res.redirect('/campgrounds')
}) 


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

module.exports = router