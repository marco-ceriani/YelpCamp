// ================================
// CAMPGROUND ROUTES
// ================================

var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground')

// INDEX
router.get('/', function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/index', {campgrounds : allCampgrounds})
        }
    })
})

// CREATE
router.post('/', isLoggedIn, function(req, res) {
    var author = {
            id: req.user._id,
            username: req.user.username
        }
    var newCampground = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        author: author
    }
    Campground.create(newCampground, function(err, camp) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/campgrounds')
        }
    })
})

// NEW
router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
})

// SHOW
router.get('/:id', function(req, res) {
    let id = req.params.id
    Campground
        .findById(id)
        .populate('comments')
        .exec(function(err, camp) {
            if (err) {
                console.log(err)
            } else {
                res.render('campgrounds/show', {campground: camp})
            }
        })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

module.exports = router
