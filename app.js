
var express    = require('express'),
	app        = express(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),
	Campground = require('./models/campground')
	seedDB     = require('./seeds')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })

//seedDB()


app.get('/', function(req, res){
	res.render('landing')
})

// INDEX
app.get('/campgrounds', function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err)
		} else {
			res.render('index', {campgrounds : allCampgrounds})
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
	res.render('new.ejs')
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
				res.render('show', {campground: camp})
			}
		})
})

app.listen('3000', 'localhost', function() {
	console.log('YelpCamp started at port 3000')
})

