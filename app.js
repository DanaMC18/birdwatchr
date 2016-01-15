var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var geocoder = require('geocoder');

// Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))

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
  db.collection('sightings').find({}).sort({date: -1}).limit(3).toArray(function (err, data){
    var recentThree = data;
    // console.log(data);
    res.render('index');
  })
});


app.get('/sightings', function (req, res){
  db.collection('sightings').find({}).sort({date: -1}).limit(3).toArray(function (err, data){
    // console.log(data);
    res.json(data);
  })
})


app.post('/sightings', function (req, res){
  console.log(req.body);
  var birdName = req.body.bird;
  var date = req.body.date;
  var address = req.body.address;
  geocoder.geocode(address, function (err, data){
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    db.collection('sightings').insert(
      {'bird': birdName, 
      'date': date, 
      'address': address,
      'lat': lat,
      'lng': lng
    }, function (err, results){
      if (err){
        console.log(err);
      } else {
        // res.redirect('/');
        res.json({'bird': birdName, 
      'date': date, 
      'address': address,
      'lat': lat,
      'lng': lng
    })
      }
    });
  })
})


app.get('/sightings/new', function (req, res){
  res.render('form');
})


app.get('/sightings/:id/edit', function (req, res){
  db.collection('sightings').findOne({_id: ObjectId(req.params.id)},
    function (err, data){
    res.render('edit', {sighting: data})
  })
})


app.patch('/sightings/:id', function (req, res){
  console.log(req.params)
  console.log(req.body)
  db.collection('sightings').update(
    {_id: ObjectId(req.params.id)},
    {$set: {bird: req.body.bird, date: req.body.date, address: req.body.address}},
    function (err, data) {
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


app.post('/geolocate', function (req, res){
  console.log(req.body.address);
  geocoder.geocode(req.body.address, function (err, data){
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var latLong = {'address': req.body.address, 'lat': lat, 'lng': lng};
    res.json(latLong);
  })
})


app.listen(process.env.PORT || 3000);







