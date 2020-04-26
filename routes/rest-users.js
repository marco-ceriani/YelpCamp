// ================================
// USER ROUTES
// ================================

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Campgrounds = require('../models/campground');
const ObjectId = require('mongoose').Types.ObjectId; 
const middleware = require('../middleware');


// User profile
router.get('/:id', (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            const {password, ...result} = user.toObject();
            res.json(result);
        }).catch(next);
})

// Campgrounds by the user
router.get('/:id/campgrounds', (req, res, next) => {
    Campgrounds.find({
        "author.id": new ObjectId(req.params.id)
    }).then(camps => {
        res.json({
            campgrounds: camps
        })
    }).catch(next);
})

module.exports = router
