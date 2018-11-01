
var express    = require('express'),
	app        = express(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}))

mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true })

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
})
var Campground = mongoose.model('Campground', campgroundSchema)

app.get('/', function(req, res){
	res.render('landing')
})

app.get('/campgrounds', function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err)
		} else {
			res.render('campgrounds', {campgrounds : allCampgrounds})
		}
	})
})

app.post('/campgrounds', function(req, res) {
	var newCampground = {
		name: req.body.name,
		image: req.body.image
	}
	Campground.create(newCampground, function(err, camp) {
		if (err) {
			console.log(err)
		} else {
			res.redirect('/campgrounds')
		}
	})
	
})

app.get('/campgrounds/new', function(req, res) {
	res.render('new.ejs')
})


app.listen('3000', 'localhost', function() {
	console.log('YelpCamp started at port 3000')
})

