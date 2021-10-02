// ================================
// USER ROUTES
// ================================

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Campgrounds = require('../models/campground');
const ObjectId = require('mongoose').Types.ObjectId;
const middleware = require('../middleware');
const { ValidationError } = require('./errors');

// Campgrounds by the user
router.get('/:id/campgrounds', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ValidationError('Missing path argument userId');
        }
        const camps = await Campgrounds.find({
            "author.id": new ObjectId(id)
        })
        res.json({ campgrounds: camps })
    } catch (error) {
        next(error);
    }
})

// User profile
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id || id == 'campgrounds') {
            throw new ValidationError('Missing path argument userId');
        }
        const user = await User.findById(id);
        res.json(user.forREST());
    } catch (error) {
        next(error);
    }
})

// New user
router.post('/', middleware.isAdmin, async (req, res, next) => {
    const { username, password } = req.body;
    console.log('Creating user %s', username)
    try {
        const newUser = new User({
            username: username,
            fullName: username
        })
        const user = await User.register(newUser, password);
        res.json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName
        });
    } catch (error) {
        console.log('Error creating user %s', username, error)
        next(error);
    }
})

router.patch('/:id/status', middleware.isAdmin, async (req, res, next) => {
    let actions = {}
    if (req.body.enable) {
        actions.$unset = { disabled: '' }
    } else {
        actions.$set = { disabled: true }
    }
    console.log('actions', actions);
    try {
        const user = await User.findByIdAndUpdate(req.params.id, actions, {
            new: true,
            lean: true
        });
        console.log(user);
        res.json(user);
    } catch (error) {
        next(error);
    }
})

// Change Password (as admin or self)
router.patch('/:id/password', middleware.isLoggedIn, async (req, res, next) => {
    const { currentPassword, newPassword} = req.body;
    try {
        if (!newPassword || (!currentPassword && !req.user.isAdmin())) {
            throw new ValidationError('Required arguments currentPassword, newPassword');
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            throw new ValidationError('Invalid id');
        }
        if (req.user.isAdmin()) {
            await user.setPassword(newPassword);
        } else if (req.user.id === user.id) {
            await user.changePassword(currentPassword, newPassword);
        } else {
            next({
                message: 'You can not change the password of this user'
            })
        }
        await user.save();
        
        res.json(user.forREST());
    } catch (error) {
        next(error);
    }
})

// All users
router.get('/', middleware.isAdmin, async (req, res, next) => {
    let filter = {}
    if (req.query.filter) {
        filter = {
            username: new RegExp(req.query.filter, 'gi')
        }
    }
    try {
        const users = await User.find(filter, null, { lean: true });
        res.json({
            users: users
        });
    } catch (error) {
        next(error);
    }
})

// Delete user
router.delete('/:id', middleware.isAdmin, async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({
            _id: req.params.id
        });
    } catch (err) {
        next(err);
    }
})

module.exports = router
