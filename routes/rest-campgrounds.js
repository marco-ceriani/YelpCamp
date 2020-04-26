// ================================
// CAMPGROUND ROUTES
// ================================

var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware'),
    geolocator = require('../lib/geolocation')()

const formatCampForList = camp => {
    const formatted = {
        id: camp._id,
        name: camp.name,
        image: camp.image,
        description: camp.description
    }
    return formatted
}

// INDEX CAMPGROUNDS
router.get('/', function (req, res) {
    const filter = { public: true }
    if (req.query.search) {
        filter.name = new RegExp(escapeRegex(req.query.search), 'gi')
    }
    Campground.find(filter, function (err, foundCampgrounds) {
        let result = {
            campgrounds: foundCampgrounds.map(formatCampForList)
        }
        if (err) {
            result.error = {
                code: 500,
                message: err
            }
        } else if (foundCampgrounds.length < 1) {
            result.error = {
                code: 404,
                message: "No campgrounds match the query provided"
            }
        }

        res.json(result)
    })
})

// CREATE CAMPGROUND
router.post('/', middleware.isLoggedIn, (req, res, next) => {
    const newCampground = {
        ...req.body,
        author: {
            id: req.user._id,
            username: req.user.username
        },
    }
    Campground.create(newCampground)
        .then(camp => {
            const result = {
                camp: {
                    id: camp._id,
                    createdAt: camp.createdAt
                }
            }
            res.json(result)
        }).catch(next);
})

// SHOW CAMPGROUND
router.get('/:id', function (req, res, next) {
    const id = req.params.id;

    Campground
        .findById(id, '-comments')
        .then(camp => {
            campObject = addMapURLs(camp.toObject());
            res.json(campObject);
        })
        .catch(next);
})

// UPDATE CAMPGROUND
router.put('/:id', middleware.isLoggedIn, async (req, res, next) => {
    try {
        const newValue = {
            ...req.body,
            author: {
                id: req.user._id,
            },
            location: await geolocator.decode(req.body.location)
        }
        const camp = await Campground.findByIdAndUpdate(req.params.id, newValue, {new: true});
        res.json({
            camp: addMapURLs(camp.toObject())
        });
    } catch (err) {
        next(err);
    }

})


// DELETE CAMPGROUND
router.delete('/:id', middleware.isLoggedIn, async (req, res, next) => {
    try {
        await Campground.findByIdAndDelete(req.params.id)
        res.json({
            id: req.params.id
        });
    } catch (err) {
        next(err);
    }

})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const addMapURLs = (camp) => {
    if (camp.location && camp.location.geo) {
        long = camp.location.geo.coordinates[0]
        lat = camp.location.geo.coordinates[1]
        camp.maplink = geolocator.getMapLink(lat, long)
        camp.mapurl = geolocator.getMapUrl(lat, long, 0.05)
    }
    return camp;
}

module.exports = router
