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
    portfolioSite : { type: String, required: false},
    description   : { type: String, required: false},
    path          : { type: String, required: false}
}));

var sitePost = mongoose.model('sitePost', mongoose.Schema({
    name           : { type: String, required: true},
    password       : { type: String, required: true},
    email          : { type: String, required: true},
    toSpend        : { type: Number, required: true},
    date           : { type: String, required: false},
    purpose        : { type: String, required: false},
    features       : { type: String, required: false},
}));

var checkIfLoggedIn = function(req, res, next){
    if ( req.session._id ) {
        console.log("user is logged in. proceeding to next route handler")
        next()
    }
    else {
        res.redirect('/register')
    }
}

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

app.post('/new-dev', upload.single('file'), function(req, res, next) {
    console.log('body: ' , req.body, req.file);

    req.body['path'] = req.file.path

    var newUser = new User(req.body)

    bcrypt.genSalt(11, function(saltErr, salt) {
        if (saltErr) { console.log(saltErr)}
        console.log('salt? ', salt)
        bcrypt.hash(req.body.password, salt, function(hashErr, hashedPassword){
            if (hashErr) { console.log(hashErr) }
            newUser.password = hashedPassword
            newUser.save(function(err){
                if (err) { console.log('failed to save new user! :(')}
                else {
                    req.session._id = newUser._id
                    res.send({success:'new user saved!'})
                }
            })
        })
    })
});

app.post('/new-site', function(req, res, next) {

    var newSite = new sitePost(req.body.newSitePost)
    
    bcrypt.genSalt(11, function(saltErr, salt) {
        if (saltErr) { console.log(saltErr)}
        console.log('salt? ', salt)
        bcrypt.hash(newSite.password, salt, function(hashErr, hashedPassword){
            if (hashErr) { console.log(hashErr) }
            newSite.password = hashedPassword
            newSite.save(function(err){
                if (err) { console.log('failed to save new site')}
                else {
                    req.session._id = newSite._id
                    res.send({success:'new site saved!'})
                }
            })

        })
    })
    // new sitePost(newSite).save(function(err, createdAnimal) {
    //     if (err) { 
    //         res.status(500).send(err);
    //         return console.log(err);
    //     }
    //     res.status(200).send(createdAnimal);
    // })
});

app.post("/currentinfo", function(req, res){
    sitePost.find(
        {},
        function(err, sitePosts) {
            if (err) {
                res.status(500).send(err);
                return console.log(err);
            }
            console.log(sitePosts)
            res.status(200).send(sitePosts);
        }
    )
})

app.get('/profile-created', function(req, res, next){
    res.sendFile('./html/profile-created.html', {root:'./public'});
});

app.listen(8080)