var mongoose  = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var User       = require("./models/user");

var userSeeds = [
    {username: "admin", password: "istrator", role: "ADMIN"},
    {username: "marco", password: "polo", fullName: "Marco Polo", avatar : "https://aff.bstatic.com/images/hotel/max500/850/85071113.jpg"},
    {username: "pippo", password: "pippo"},
    {username: "mickey", password: "mouse", fullName: "Mickey Mouse"}
]

var campSeeds = [
    {
        name: "Cloud's Rest", 
        image: "/photos/13208593975.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: '9.99'
    },
    {
        name: "Desert Mesa", 
        image: "/photos/18103628621.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: '5.40'
    },
    {
        name: "Canyon Floor", 
        image: "/photos/3820664827.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: '7.50'
    },
    {
        name: "Salmon Creek", 
        image: "/photos/1208201.png",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: '12.00'
    },
    {
        name: "Sunny Side", 
        image: "/photos/1851092.png",
        description: "A sunny campground with a breath breaking landscape",
        price: '1.99'
    },
    {
        name: "Hell's Camp", 
        image: "/photos/1867275.png",
        description: "It's great to tell ghost's stories in this place frozen as hell",
        price: '6.66'
    }
]

var commentSeeds = [
    'My hands are writing words.',
    'this is a random comment!',
    'blah blah blah',
    'The best in the world!',
    'Great!',
    'First!',
    'OMG! I got top comment!'
]

async function seedDB() {

    await User.deleteMany({})
    let users = await Promise.all(userSeeds.map(async user => {
        let newUser = new User(user)
        return User.register(newUser, user.password)
    }))
    users.shift()
    function randomUser() {
        return users[Math.floor(Math.random() * users.length)]
    }
    
    await Campground.deleteMany({})
    await Comment.deleteMany({})

    for (const seed of campSeeds) {
        let author = randomUser()
        const newCampgroundData = {
            ...seed,
            author : { 
                id: author._id,
                username: author.username
            }
        }
        let campground = await Campground.create(newCampgroundData)
        for (let i = 0; i < 2; i++) {
            let author = randomUser()
            let commentInfo = {
                text: commentSeeds[Math.floor(Math.random() * commentSeeds.length)],
                author : { 
                    id: author._id,
                    username: author.username
                }
            }
            let comment = await Comment.create(commentInfo)
            campground.comments.push(comment)
            await campground.save()
        }
    }

}

module.exports = seedDB

