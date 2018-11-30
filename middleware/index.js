
var Campground = require('../models/campground'),
    Comment    = require('../models/comment')

var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (!req.user.disabled) {
            return next()
        } else {
            req.flash("error", "You're account has been disabled")
            res.redirect('back')
        }
    } else {
        req.flash("error", "You need to be logged in")
        res.redirect('/login')
    }
}

middlewareObj.isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin()) {
            return next()
        } else {
            req.flash("error", "Unauthorized")
            res.redirect('back')
        }
    } else {
        req.flash("error", "You need to be logged in")
        res.redirect('/login')
    }
}

middlewareObj.checkCommentAuthor = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to be logged in to do that")
        res.redirect('back')
    } else if (req.user.disabled) {
        req.flash("error", "You're account has been disabled")
            res.redirect('back')
    } else {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found")
                res.redirect('back')
            } else if (!foundComment) {
                req.flash("error", "Comment not found")
                res.redirect('back')
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.role === 'ADMIN') {
                    return next()
                } else {
                    req.flash("error", "You don't have the required permission")
                    res.redirect('back')
                }
            }
        })
    }
}

middlewareObj.checkCampgroundAuthor = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You need to be logged in to do that")
        res.redirect('back')
    } else if (req.user.disabled) {
        req.flash("error", "You're account has been disabled")
        res.redirect('back')
    } else {
            Campground.findById(req.params.id, function(err, campground) {
                if (err) {
                    req.flash("error", "Campground not found")
                    res.redirect('back')
                } else if (!campground) {
                    req.flash("error", "Campground not found")
                    res.redirect('back')
                } else {
                    // author.id is an object not a string
                    if (campground.author.id.equals(req.user._id) || req.user.role === 'ADMIN') {
                        return next()
                    } else {
                        req.flash("error", "You don't have the required permission")
                        res.redirect('back')
                    }
                }
            })
    }   
}

module.exports = middlewareObj
