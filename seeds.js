var mongoose = require("mongoose");
var faker = require("faker");
var geolocation = require("./lib/geolocation")();
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

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

// List of random locations with data from OpenStreetMap
const locations = [
    {
        latitude: 45.8327057,
        longitude: 6.8651706,
        formattedAddress: 'Monte Bianco',
        country: 'Italia',
        countryCode: 'IT'
    }, {
        latitude: 5.7330227,
        longitude: 115.9320971,
        formattedAddress: 'Papar, Sabah, 89607 PAPAR, Malaysia',
        country: 'Malaysia',
        countryCode: 'MY'
    }, {
        latitude: 55.0512443,
        longitude: -162.8916892,
        formattedAddress: 'Aleutians East, Alaska, United States',
        country: 'United States',
        countryCode: 'US'
    }, {
        latitude: -3.4178355,
        longitude: 38.36706762808966,
        formattedAddress: 'Taita Taveta, Coastal Kenya, Kenya',
        country: 'Kenya',
        countryCode: 'KE'
    }, {
        latitude: -32.9833175,
        longitude: 135.32306375148252,
        formattedAddress: 'Wudinna District Council, South Australia, Australia',
        country: 'Australia',
        countryCode: 'AU'
    }, {
        latitude: -31.7613365,
        longitude: -71.3187697,
        formattedAddress: 'Chile',
        country: 'Chile',
        countryCode: 'CL'
    }, {
        latitude: 12.2367475,
        longitude: -3.3387562016398076,
        formattedAddress: 'Mouhoun, Boucle du Mouhoun, Burkina Faso',
        country: 'Burkina Faso',
        countryCode: 'BF'
    }, {
        latitude: 69.5191148,
        longitude: -128.964413,
        formattedAddress: 'Inuvialuit Settlement Region, Inuvik Region, Northwest Territories, Canada',
        country: 'Canada',
        countryCode: 'CA'
    }, {
        latitude: 77.6192349,
        longitude: -42.8125967,
        formattedAddress: 'Kalaallit Nunaat',
        country: 'Kalaallit Nunaat',
        countryCode: 'GL'
    },
    {
        latitude: -2.3316707,
        longitude: -79.4026362,
        formattedAddress: 'El Triunfo, Ecuador',
        country: 'Ecuador',
        countryCode: 'EC'
    }, {
        latitude: 31.09381305,
        longitude: -111.88979063990689,
        formattedAddress: 'Altar, Sonora, 83750, México',
        country: 'México',
        countryCode: 'MX'
    }, {
        latitude: 54.787989100000004,
        longitude: 74.81173078419397,
        formattedAddress: 'Сергеевское сельское поселение, Оконешниковский район, Омская область, Сибирский федеральный округ, Россия',
        country: 'Россия',
        countryCode: 'RU'
    }, {
        latitude: 34.2709878,
        longitude: -4.063217678685499,
        formattedAddress: 'Meknassa Al Gharbia مكناسة الغربية, caïdat de Meknassa, cercle de Taza دائرة تازة, Province de Taza إقليم تازة, Fès-Meknès ⴼⴰⵙ-ⵎⴽⵏⴰⵙ فاس-مكناس, Maroc / ⵍⵎⵖⵔⵉⴱ / المغرب',
        country: 'Maroc / ⵍⵎⵖⵔⵉⴱ / المغرب',
        countryCode: 'MA'
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
    console.log('deleting campgrounds')
    await Campground.deleteMany({})
    console.log('deleting comments')
    await Comment.deleteMany({})
    console.log('deleting users')
    await User.deleteMany({})
    console.log('----- CLEAR DB -----')
}

async function initDB() {
    console.log('----- INITIALIZE DB -----')
    const numUsers = await User.count()
    if (numUsers == 0) {
        console.log('creating ADMIN user')
        User.register({ 
            username: 'admin',
            fullName: 'Administrator',
            role: 'ADMIN'
        }, 'changeit')
    }
    console.log('----- INITIALIZE DB -----')
}

async function seedUsers(requestedUsers = 30) {
    const numUsers = await User.estimatedDocumentCount();
    if (numUsers < requestedUsers) {
        promises = []
        console.log('creating users')
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
            const password = faker.internet.password()
            promises.push(User.register(newUser, password))
        }
        await Promise.all(promises)
        console.log('created %d users', requestedUsers - numUsers)
    }
}

function randomUser(users) {
    return users[Math.floor(Math.random() * users.length)]
}

async function addCampgroundComments(campground, users, range = [5, 15], length = [8, 16]) {
    const numComments = faker.datatype.number({ min: range[0], max: range[1] })
    for (let i = 0; i < numComments; i++) {
        let author = randomUser(users)
        let commentInfo = {
            text: faker.lorem.sentence(
                faker.datatype.number({ min: length[0], max: length[1] })
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
    console.log('----- CREATE TEST DATA -----')
    await seedUsers()
    let users = await User.find({}, '+_id')

    const now = new Date()
    console.log('creating test data')
    promises = []
    let startingCamps = await Campground.estimatedDocumentCount()
    for (let i = startingCamps; i < numCamps; i++) {
        console.log('creating campground ' + i + '/' + numCamps)
        let author = randomUser(users)
        let picture = randomPicture()
        const campLocation = locations[i % locations.length]
        const newCampgroundData = {
            name: randomCampName(),
            image: '/photos/' + picture.filename,
            author: {
                id: author._id,
                username: author.username
            },
            description: faker.lorem.paragraphs(3) + '\n' + picture.credit,
            price: faker.commerce.price(0, 15, 2, '€'),
            createdAt: faker.date.past(2),
            public: true,
            location: {
                geo: {
                    type: "Point",
                    coordinates: [campLocation.longitude, campLocation.latitude],
                },
                textual: campLocation.formattedAddress,
                country: campLocation.country
            }
        }
        let campground = await Campground.create(newCampgroundData)
        promises.push(
            addCampgroundComments(campground, users)
        )
    }
    await Promise.all(promises)
    console.log('----- CREATE TEST DATA -----')
}

const patchSchema = async () => {
    Campground.updateMany({ public: { $exists: false } }, { public: true })
        .then(res => console.log(res))
        .catch(err => console.log('error ' + err));
}

module.exports = {
    createData: seedDB,
    clearDB: clearDB,
    initDB: initDB,
    patchSchema: patchSchema
}
