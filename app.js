var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongodb-session')(session);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mongo_pw = process.env.MONGO_PW;
var url = 'mongodb://localhost:27017/secret';
var session_url = 'mongodb://@localhost:27017/secrets';


app.use(session({
  secret: 'replace me with long random string',
  resave: true,
  saveUninitialized: true,
  store: new MongoDBStore( { url: session_url })
}));


require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect(url);

app.use('/', index);
app.use('/users', users);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
