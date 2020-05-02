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

router.patch('/:id/status', middleware.isAdmin, async (req, res, next) => {
    let actions = {}
    console.log(req.body);
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

// All users
router.get('/', middleware.isAdmin, async (req, res, next) => {
    try {
        const users = await User.find({}, null, { lean: true });
        res.json({
            users: users
        });
    } catch (error) {
        next(error);
    }
})

// All users
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
