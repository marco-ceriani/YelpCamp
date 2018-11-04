
var express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	mongoose       = require('mongoose'),
	passport       = require('passport'),
	LocalStrategy  = require('passport-local'),
	methodOverride = require('method-override'),
	Campground     = require('./models/campground'),
	Comment        = require('./models/comment'),
	User           = require('./models/user'),
	seedDB         = require('./seeds')

// requiring routes
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes    = require('./routes/comments'),
	indexRoutes      = require('./routes/index')

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(methodOverride('_method'))

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

app.use(indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


var args = process.argv.slice(2)
if (args.indexOf('--reset') >= 0) {
	seedDB()	
}

app.listen('3000', 'localhost', function() {
	console.log('YelpCamp started at port 3000')
})

