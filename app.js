
var express    = require('express'),
	app        = express(),
	bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),
	Campground = require('./models/campground')
	Comment    = require('./models/comment')
	seedDB     = require('./seeds')

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
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
app.get('/campgrounds/:id/comments/new', function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', {campground: campground})
		}
	})	
})

// CREATE
app.post('/campgrounds/:id/comments', function(req, res) {
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

app.listen('3000', 'localhost', function() {
	console.log('YelpCamp started at port 3000')
})

