// ================================
// CAMPGROUND ROUTES
// ================================

var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware'),
    geolocator = require('../lib/geolocation')()

// INDEX CAMPGROUNDS
router.get('/', function(req, res) {
    const filter = {public: true}
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        filter.name = regex
    }
    Campground.find(filter, function(err, foundCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            var queryMessage = null;
            if (foundCampgrounds.length < 1) {
                queryMessage = "No campgrounds match the query provided"
            }
            res.render('campgrounds/index', {
                campgrounds : foundCampgrounds,
                page: 'campgrounds',
                queryMessage : queryMessage
            })
        }
    })
})

// CREATE CAMPGROUND
router.post('/', middleware.isLoggedIn, function(req, res) {
    var author = {
            id: req.user._id,
            username: req.user.username
        }
    var newCampground = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: author,
        location: req.body.location
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
router.get('/new', middleware.isLoggedIn, function(req, res) {
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
            } else if (camp) {
                if (camp.location && camp.location.geo) {
                    lon = camp.location.geo.coordinates[0]
                    lat = camp.location.geo.coordinates[1]                    
                    camp.maplink = geolocator.getMapLink(lat, lon)
                    camp.mapurl = geolocator.getMapUrl(lat, lon, 0.05)
                }
                res.render('campgrounds/show', {campground: camp})
            } else {
                req.flash("error", 'campground not found')
                res.redirect('/campgrounds')
            }
        })
})

// EDIT CAMPGROUND
router.get('/:id/edit', middleware.checkCampgroundAuthor, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.flash('Campground not found')
        } else {
            res.render('campgrounds/edit', {campground: campground})
            // err ? there could be a critical race with a destroy. do we care?
        }
    })
})

// UDPATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundAuthor, async function(req, res) {
    let camp = req.body.campground
    const location = camp.location.textual
    console.log(location)
    if (location) {
        let results = await geolocator.search(location)
        console.log(results)
        if (results && results.length > 0) {
            camp.location.geo = {
                type: 'Point',
                coordinates: [ results[0].longitude, results[0].latitude ]
            }
        }
        console.log(camp)
    }
    Campground.findByIdAndUpdate(req.params.id, camp, function(err, camp) {
        if (err) {
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// DESTROY CAMPGROUND
router.delete('/:id', middleware.checkCampgroundAuthor, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, campground) {
        Comment.deleteMany({
            _id:{ 
                $in: campground.comments 
            }
        }, function(err, comments) {
            req.flash(err ? 'error' : 'success', campground.name + ' deleted')
            res.redirect('/campgrounds')
        })
    })
})


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router
