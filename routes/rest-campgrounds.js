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
    var filter = {}
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi')
        filter = { name: regex }
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
            console.log(err)
        } else if (foundCampgrounds.length < 1) {
            result.error = {
                code: 404,
                message: "No campgrounds match the query provided"
            }
        }

        res.json(result)
    })
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
