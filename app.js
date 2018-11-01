
var express = require('express'),
	bodyParser = require('body-parser')
var app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}))

//1208201.png  13208593975.png  18103628621.png  1851092.png  1867275.png  3820664827.png

campgrounds = [
	{name: 'Salmon Creek', image: '/photos/1208201.png'},
	{name: 'Tuna Creek', image: '/photos/13208593975.png'},
	{name: 'Seabass Creek', image: '/photos/18103628621.png'}
]

app.get('/', function(req, res){
	res.render('landing')
})

app.get('/campgrounds', function(req, res) {
	res.render('campgrounds', {campgrounds : campgrounds})
})

app.post('/campgrounds', function(req, res) {
	var newCampground = {
		name: req.body.name,
		image: req.body.image
	}
	campgrounds.push(newCampground)
	res.redirect('/campgrounds')
})

app.get('/campgrounds/new', function(req, res) {
	res.render('new.ejs')
})


app.listen('3000', 'localhost', function() {
	console.log('YelpCamp started at port 3000')
})

