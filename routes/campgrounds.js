// ================================
// CAMPGROUND ROUTES
// ================================

var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground')

// INDEX CAMPGROUNDS
router.get('/', function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/index', {campgrounds : allCampgrounds})
        }
    })
})

// CREATE CAMPGROUND
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

// NEW CAMPGROUND
router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
})

// SHOW CAMPGROUND
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

// EDIT CAMPGROUND
router.get('/:id/edit', checkCampgroundAuthor, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       res.render('campgrounds/edit', {campground: campground})
       // err ? there could be a critical race with a destroy. do we care?
    })
})

// UDPATE CAMPGROUND
router.put('/:id', checkCampgroundAuthor, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp) {
        if (err) {
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY CAMPGROUND
router.delete('/:id', checkCampgroundAuthor, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
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

function checkCampgroundAuthor(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                res.redirect('back')
            } else {
                // author.id is an object not a string
                if (campground.author.id.equals(req.user._id)) {
                    return next()
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back')
    }   
}

module.exports = router
