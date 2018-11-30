// ================================
// USER ROUTES
// ================================

var express    = require('express'),
    router     = express.Router(),
    User       = require('../models/user'),
    middleware = require('../middleware')

// INDEX USERS
router.get('/', middleware.isAdmin, function(req, res) {
    User.find({}, function(err, allUsers) {
        if (err) {
            console.log(err)
        } else {
            res.render('users/index', {users : allUsers, page: 'users'})
        }
    })
})

// SHOW USER
// router.get('/:id', function(req, res))
// {
//     let id = req.params.id;
//     User.findById(id, function(err, user) {
//         if (err) {
//             req.flash('error', 'User not found')
//             return res.redirect('back')
//         } 
//     })
// }

// UPDATE USER FIELDS
router.patch('/:id/status', middleware.isAdmin, function(req, res) {
    let actions = {}
    if (req.body.disable == 'true') {
        actions.$set = { disabled: true }
        console.log('disabling user ' + req.params.id)
    } else {
        actions.$unset = { disabled: '' }
        console.log('enabling user ' + req.params.id)
    }
    User.findByIdAndUpdate(req.params.id, actions, {new:true}, function(err, user) {
        if (err) {
            console.log('error updating the user ' + err)
        }
    })
    res.redirect('back')
})

// DESTROY USER
router.delete('/:id', middleware.isAdmin, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err)
            req.flash('error', 'cannot remove user: ' + err)
        }
        res.redirect('back')
    })
})

module.exports = router

