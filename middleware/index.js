
var Campground = require('../models/campground'),
    Comment    = require('../models/comment')

var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/login')
    }
}

middlewareObj.checkCommentAuthor = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect('back')
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
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

middlewareObj.checkCampgroundAuthor = function(req, res, next) {
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

module.exports = middlewareObj
