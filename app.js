
var express       = require('express'),
	app           = express(),
	bodyParser    = require('body-parser'),
	mongoose      = require('mongoose'),
	passport      = require('passport'),
	LocalStrategy = require('passport-local'),
	Campground    = require('./models/campground'),
	Comment       = require('./models/comment'),
	User          = require('./models/user'),
	seedDB        = require('./seeds')

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended : true}))

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'The archaic idea refines a nuclear room.',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	next()
})

var args = process.argv.slice(2)
if (args.indexOf('--reset') >= 0) {
	seedDB()	
}



app.get('/', function(req, res){
	res.render('landing')
})

// INDEX
app.get('/campgrounds', function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds/index', {campgrounds : allCampgrounds})
		}
	})
})

// CREATE
app.post('/campgrounds', function(req, res) {
	var newCampground = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}
	Campground.create(newCampground, function(err, camp) {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/campgrounds')
		}
	})
})

// NEW
app.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new')
})

// SHOW
app.get('/campgrounds/:id', function(req, res) {
	let id = req.params.id
	Campground
		.findById(id)
		.populate('comments')
		.exec(function(err, camp) {
			if (err) {
				console.log(err)
			} else {
				res.render('campgrounds/show', {campground: camp})
			}
		})
})

// ================================
// COMMENTS ROUTES
// ================================

// NEW
app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', {campground: campground})
		}
	})	
})

// CREATE
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, camp) {
		if (err) {
			console.log(err)
			res.redirect('/campgrounds')
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err)
				} else {
					camp.comments.push(comment)
					camp.save()
					res.redirect('/campgrounds/'+ camp._id)
				}
			})
		}
	})
})

// Authentication routes

app.get('/register', function(req, res) {
	res.render('register')
})

app.post('/register', function(req, res){
	let username = req.body.username
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log('error creating user ' + username + ' :' + err)
			return res.render('register')
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect('campgrounds')
		})
	})
})

app.get('/login', function(req, res) {
	res.render('login')
})

app.post('/login', 
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	function(req, res) {}
)

app.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/campgrounds')
}) 


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	} else {
		res.redirect('/login')
	}
}

app.listen('3000', 'localhost', function() {
	console.log('YelpCamp started at port 3000')
})

