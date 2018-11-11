
var express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	mongoose       = require('mongoose'),
	flash          = require('connect-flash'),
	passport       = require('passport'),
	LocalStrategy  = require('passport-local'),
	methodOverride = require('method-override'),
	Campground     = require('./models/campground'),
	Comment        = require('./models/comment'),
	User           = require('./models/user'),
	seedDB         = require('./seeds')

require('dotenv').config()

// requiring routes
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes    = require('./routes/comments'),
	indexRoutes      = require('./routes/index')

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(flash())

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
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next()
})

app.use(indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


var args = process.argv.slice(2)
if (args.indexOf('--reset') >= 0) {
	seedDB()	
}

var port = process.env.PORT || 8080
app.listen(port, process.env.IP, function() {
	console.log('YelpCamp started at port ' + port)
})

