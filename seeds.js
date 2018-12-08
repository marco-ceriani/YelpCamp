var mongoose = require("mongoose");
var faker = require("faker");
var geolocation = require("./api/geolocation")();
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

var userSeeds = [
    { username: "marco", password: "polo", fullName: "Marco Polo", avatar: "https://aff.bstatic.com/images/hotel/max500/850/85071113.jpg" },
    { username: "pippo", password: "pippo" },
    { username: "mickey", password: "mouse", fullName: "Mickey Mouse" }
]

const pictures = [
    { filename: "adrian-393713-unsplash.jpg", credit: "Photo by adrian on Unsplash" },
    { filename: "adventure-alps-camp-618848.jpg", credit: "Photo by Sagui Andrea from Pexels" },
    { filename: "adventure-camp-camper-1309586.jpg", credit: "Photo by Lukas from Pexels" },
    { filename: "adventure-camp-clouds-939723.jpg", credit: "Photo by ajay bhargav GUDURU from Pexels" },
    { filename: "avi-naim-781589-unsplash.jpg", credit: "Photo by Avi Naim on Unsplash" },
    { filename: "ben-duchac-66129-unsplash.jpg", credit: "Photo by Ben Duchac on Unsplash" },
    { filename: "camping-campsite-grass-116104.jpg", credit: "Photo by David McBee from Pexels" },
    { filename: "dino-reichmuth-123637-unsplash.jpg", credit: "Photo by Dino Reichmuth on Unsplash" },
    { filename: "photo-1520732713659-8f14034ba7d6.jpg", credit: "Photo by Patrick Hendry on Unsplash" },
    { filename: "teddy-kelley-194162-unsplash.jpg", credit: "Photo by Teddy Kelley on Unsplash" }
]

const campNames = {
    adjectives: [
        "peaceful",
        "quiet",
        "mystic",
        "magic",
        "secret",
        "hidden",
        "great"
    ],
    names: [
        "camp",
        "forest",
        "lake",
        "peak",
        "mountain",
        "plain",
        "valley",
        "canyon",
        "mesa",
        "creek"
    ]
}

var campSeeds = [
    {
        name: "Cloud's Rest",
        location: {
            textual: "Monte Bianco",
            geo: {
                type: "Point",
                coordinates: [6.8651661, 45.8326753]
            }
        }
    },
    {
        name: "Sunny Side",
        location: {
            textual: "Milano",
            geo: {
                type: "Point",
                coordinates: [9.1885548, 45.4641385]
            }
        }
    }
]

function randomPicture() {
    return pictures[Math.floor(Math.random() * pictures.length)]
}

function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

function randomCampName() {
    let adj = campNames.adjectives[Math.floor(Math.random() * campNames.adjectives.length)]
    let name = campNames.names[Math.floor(Math.random() * campNames.names.length)]
    return capitalizeWord(adj) + ' ' + capitalizeWord(name)
}

async function clearDB() {
    console.log('----- CLEAR DB -----')
    console.log('deleting users')
    await User.deleteMany({})
    console.log('deleting campgrounds')
    await Campground.deleteMany({})
    console.log('deleting comments')
    await Comment.deleteMany({})
    console.log('Creating ADMIN user')
    let user = User.register({ username: 'admin', role: 'ADMIN' }, 'istrator')
    console.log('----- CLEAR DB -----')
    return user
}

async function seedUsers(requestedUsers = 30) {
    const numUsers = await User.estimatedDocumentCount();
    promises = []
    if (numUsers == 0) {
        promises = userSeeds.map(async user => {
            let newUser = new User(user)
            delete newUser.password
            return User.register(newUser, user.password)
        })
    }
    for (let i = numUsers; i < requestedUsers; i++) {
        let gender = faker.random.arrayElement([0, 1])
        let firstName = faker.name.firstName(gender)
        let lastName = faker.name.lastName(gender)
        let newUser = new User({
            username: faker.helpers.slugify(firstName + '.' + lastName).toLowerCase(),
            fullName: faker.name.findName(firstName, lastName, gender),
            email: faker.internet.email(firstName, lastName),
            avatar: faker.image.avatar()
        })
        promises.push(User.register(newUser, 'pippo'))
    }
    return Promise.all(promises)
}

function randomUser(users) {
    return users[Math.floor(Math.random() * users.length)]
}

async function randomLocation() {
    let coordinates = null
    let result = null
    for (let i = 0; i < 5; i++) {
        coordinates = [
            Number(faker.address.longitude()),
            Number(faker.address.latitude())
        ]
        try {
            result = await geolocation.reverse(coordinates[1], coordinates[0], zoom=12)
            break
        } catch (err) {
        }
    }
    var location = {
        geo: {
            type: "Point",
            coordinates: coordinates
        }
    }
    if (result) {
        location.textual = result[0].formattedAddress
        location.country = result[0].countryCode
    } else {
        location.textual = "Somewhere"
    }
    return location
}

async function addCampgroundComments(campground, users, range = [5, 15], length = [8, 16]) {
    const numComments = faker.random.number({ min: range[0], max: range[1] })
    for (let i = 0; i < numComments; i++) {
        let author = randomUser(users)
        let commentInfo = {
            text: faker.lorem.sentence(
                faker.random.number({ min: length[0], max: length[1] })
            ),
            author: {
                id: author._id,
                username: author.username
            },
            createdAt: faker.date.between(campground.createdAt, new Date())
        }
        let comment = await Comment.create(commentInfo)
        campground.comments.push(comment)
    }
    campground.save()
}

async function seedDB(numCamps = 11) {

    await seedUsers()
    let users = await User.find({}, '+_id')

    const now = new Date()
    console.log('creating test data')
    promises = []
    let startingCamps = await Campground.estimatedDocumentCount()
    for (let i = startingCamps; i < numCamps; i++) {
        let author = randomUser(users)
        let picture = randomPicture()
        const newCampgroundData = {
            name: randomCampName(),
            image: '/photos/' + picture.filename,
            author: {
                id: author._id,
                username: author.username
            },
            description: faker.lorem.paragraphs(3) + '\n' + picture.credit,
            price: faker.commerce.price(0, 15, 2, '€'),
            createdAt: faker.date.past(2)
        }
        if (i < campSeeds.length) {
            newCampgroundData.location = campSeeds[i].location
        } else {
            newCampgroundData.location = await randomLocation()
        }
        let campground = await Campground.create(newCampgroundData)
        promises.push(
            addCampgroundComments(campground, users)
        )
    }
    await Promise.all(promises)

}

module.exports = {
    createData: seedDB,
    clearDB: clearDB
}
