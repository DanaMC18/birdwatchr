var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var geocoder = require('geocoder');

// Configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoUrl = 'mongodb://localhost:27017/birdwatch';
var db;

MongoClient.connect(mongoUrl, function (err, database){
  if (err) {
    console.log(err);
  }
  console.log('connected!');
  db = database;

  process.on('exit', db.close);
})

// Routes
app.get('/', function(req, res){
  db.collection('sightings').find({}).sort({$natural: -1}).limit(3).toArray(function (err, data){
    var recentThree = data;
    res.render('index', {sightings: data});
  })
});

app.get('/sightings/new', function (req, res){
  res.render('form');
})


app.post('/sightings', function (req, res){
  console.log(req.body);
  var birdName = req.body.sighting.bird;
  var date = req.body.sighting.date;
  var address = req.body.sighting.address
  geocoder.geocode(address, function (err, data){
    // console.log(data.results[0].geometry.location.lat, data.results[0].geometry.location.lat);
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    db.collection('sightings').insert(
      {'bird': birdName, 
      'date': date, 
      'address': address,
      'lat': lat,
      'lng': lng
    });
    res.redirect('/');
  })
})


app.get('/api/sightings', function (req, res){
  db.collection('sightings').find({}).toArray(function (err, data){
    res.json(data);
  })
})


app.get('/demo', function (req, res){
  res.render('demo');
})


app.get('/demo_sightings', function (req, res){
  db.collection('sightings').find({}).sort({$natural: -1}).toArray(function (err, data){
    res.json(data);
  })
})

app.listen(process.env.PORT || 3000);







