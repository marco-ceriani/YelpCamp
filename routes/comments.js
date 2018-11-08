// ================================
// COMMENTS ROUTES
// ================================

var express    = require('express'),
    router     = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment    = require('../models/comment'),
    middleware = require('../middleware')

// Comments New
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground})
        }
    })  
})

// Comments Create
router.post('/', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err)
                } else {
                    comment.author.username = req.user.username
                    comment.author.id = req.user._id
                    comment.save()
                    camp.comments.push(comment)
                    camp.save()
                    res.redirect('/campgrounds/'+ camp._id)
                }
            })
        }
    })
})

// Comments Edit
router.get('/:comment_id/edit', middleware.checkCommentAuthor, function(req, res) {
    // from parent route
    campgroundId = req.params.id
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            res.redirect('back')
        } else {
            res.render('comments/edit', 
                {campground_id: campgroundId, comment:comment})
        }
    })
})

// Comments Update
router.put('/:comment_id', middleware.checkCommentAuthor, function(req, res) {
    Comment.findByIdAndUpdate( req.params.comment_id, req.body.comment, function(err, camp) {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// Comments Destroy
router.delete('/:comment_id', middleware.checkCommentAuthor, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            console.log(err)
            res.redirect('/campgrounds/' + req.params.id)
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

module.exports = router
