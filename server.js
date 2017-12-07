var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var express = require('express');
var sessions = require("client-sessions");

var app = express();
app.use(express.static('./public'))

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
    postID         : { type: String, required: true},
    name           : { type: String, required: true},
    password       : { type: String, required: true},
    email          : { type: String, required: true},
    wantToSpend    : { type: Number, required: true },
    description    : { type: String, required: false },
    desiredFeatures: { type: String, required: false },
}));

app.get('/', function(req, res){
    res.sendFile('./html/intro.html', {root:'./public'});
});

app.get('/main', function(req, res, next){
    res.sendFile('./html/main.html', {root:'./public'});
});

app.get('/web-prices', function(req, res, next){
    res.sendFile('./html/webprices.html', {root:'./public'});
});

app.get('/siteform', function(req, res, next){
    res.sendFile('./html/site-form.html', {root:'./public'});
});

app.get('/request-site-home', function(req, res, next){
    res.sendFile('./html/request-site-home.html', {root:'./public'});
});

app.get('/create-dev-profile', function(req, res, next){
    res.sendFile('./html/create-dev-profile.html', {root:'./public'});
});

app.post('/new-dev', function(req, res, next) {
    console.log("New dev form at server", req)
});

app.get('/profile-created', function(req, res, next){
    res.sendFile('./html/profile-created.html', {root:'./public'});
});

app.listen(8080)