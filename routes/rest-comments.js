// ================================
// COMMENTS ROUTES
// ================================

var express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware')

router.get('/', (req, res, next) => {
    Campground
        .findById(req.params.camp_id, 'comments')
        .populate({ path: 'comments', options: { sort: { createdAt: -1 } } })
        .then(camp => {
            res.json(camp);
        }).catch(next);
});

// Comments Create
router.post('/', middleware.isLoggedIn, (req, res, next) => {
    Campground.findById(req.params.camp_id)
        .then(camp => {
            Comment.create({
                text: req.body.text,
                author: {
                    username: req.user.username,
                    id: req.user._id
                }
            }).then(comment => {
                camp.comments.push(comment)
                camp.save()
                res.json(comment);
            }).catch(next);
        })
        .catch(next);
});

// Comments Update
router.put('/:comment_id', middleware.checkCommentAuthor, (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body, { new: true })
        .then(comment => {
            res.json(comment);
        }).catch(next);
})

// Comments Destroy
router.delete('/:comment_id', middleware.checkCommentAuthor, (req, res, next) => {
    Comment.findByIdAndRemove(req.params.comment_id)
        .then(() => {
            res.status(204).end();
        }).catch(next);
})

module.exports = router
