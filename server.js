var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var express = require('express');
var sessions = require("client-sessions");
var multer  = require('multer')

var app = express();
app.use(express.static('./public'))
var upload = multer({dest:'uploads/'});

var cpUpload = upload.single('postImg');
var secrets = require("./secrets")

var sessionsMiddleware = sessions({
    cookieName: 'auth-cookie',  // front-end cookie name
    secret: secrets.secret,        // the encryption password : keep this safe
    requestKey: 'session',    // we can access our sessions at req.session,
    duration: (86400 * 1000) * 7 * 52, // one YEAR in milliseconds
    cookie: {
        ephemeral: false,     // when true, cookie expires when browser is closed
        httpOnly: true,       // when true, the cookie is not accesbile via front-end JavaScript
        secure: false         // when true, cookie will only be read when sent over HTTPS
    }
}) // encrypted cookies!

app.use(sessionsMiddleware)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/** Database setup **/
mongoose.connect('mongodb://localhost/slick', function(err) {
    if( err ) {
        console.error('Could not connect to Mongo');
    } else {
        console.info("Connected to Mongo!");
    }
});

var User = mongoose.model('user', mongoose.Schema({
    username      : { type: String, required: true, unique: true },
    password      : { type: String, required: true },
    name          : { type: String, required: true},    
    portfolioSite : { type: String, required: false },
    description   : { type: String, required: false },
}));

var sitePost = mongoose.model('sitePost', mongoose.Schema({
    name           : { type: String, required: true},
    password       : { type: String, required: true},
    email          : { type: String, required: true},
    wantToSpend    : { type: Number, required: true },
    timeline       : { type: Date,   required: false},
    description    : { type: String, required: false },
    desiredFeatures: { type: String, required: false },
}));

app.get('/', function(req, res){
    res.sendFile('./html/index.html', {root:'./public'});
});

app.get('/main', function(req, res, next){
    res.sendFile('./html/main.html', {root:'./public'});
});

app.get('/web-prices', function(req, res, next){
    res.sendFile('./html/webprices.html', {root:'./public'});
});

app.get('/site-form', function(req, res, next){
    res.sendFile('./html/site-form.html', {root:'./public'});
});

app.get('/request-site-home', function(req, res, next){
    res.sendFile('./html/request-site-home.html', {root:'./public'});
});

app.get('/create-dev-profile', function(req, res, next){
    res.sendFile('./html/create-dev-profile.html', {root:'./public'});
});

app.post('/new-dev', function(req, res, next) {
    console.log('body: ' + JSON.stringify(req.body));
	res.send(req.body);
});

app.post('/new-site', function(req, res, next) {
    res.send(req.body);
    let newSite = {
        name           : req.body.newSitePost.name,
        password       : req.body.newSitePost.password,
        email          : req.body.newSitePost.email,
        wantToSpend    : req.body.newSitePost.toSpend,
        timeline       : req.body.newSitePost.timeline,
        description    : req.body.newSitePost.purpose,
        desiredFeatures: req.body.newSitePost.features,
    },
    new sitePost(newSite).save(function(err, createdAnimal) {
        if (err) { 
            res.status(500).send(err);
            return console.log(err);
        }
        res.status(200).send(createdAnimal);
    })
});

app.get('/profile-created', function(req, res, next){
    res.sendFile('./html/profile-created.html', {root:'./public'});
});

app.listen(8080)