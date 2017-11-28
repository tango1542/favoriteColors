var express = require('express');
var router = express.Router();
var passport = require("passport");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// This is a route used with the form where a user can update their favorite colore and number.
router.post('/saveSecrets', isLoggedIn, function(req, res, next){

  // This would check if none of the data has changed.  If so, it gives the message to enter new or different data.
  if (!req.body.color && !req.body.luckyNumber) {
    req.flash('updateMsg', 'Please enter some new data');
    return res.redirect('/secret')
  }

// Adds any updated data

  if (req.body.color) {
    req.user.favorites.color = req.body.color;
  }
  if (req.body.luckyNumber) {
    req.user.favorites.luckyNumber = req.body.luckyNumber;
  }

  // This would be updating the data for whatevr user object is is referring to.
  req.user.save(function(err) {
    if (err) {
      if (err.name == 'ValidationError') {
        req.flash('updateMsg', 'Error updating, check your data is valid');
      }
      else {
        return next(err);
      }
    }

    else {
      req.flash('updateMsg', 'Updated data');
    }


    return res.redirect('/secret');
  })
});

// Main login page route.  It would display the information, and send the route on to the /signup or /auth/twitter routes.
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/auth/twitter', passport.authenticate('twitter'))

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/secret',
  failureRedirect: '/'
}));

router.get('/signup', function(req, res, next){
  res.render('signup')
});

// This is the route for the login.  If the database matches, the route goes on to /secret.  If it fails, the route goes to /login.
router.post('/login', passport.authenticate('local-login', {
  successRedirect: "/secret",
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/secret',
  failureRedirect: '/signup',
  failureFlash: true
}));

// This is the main secret page, or index page, where user information would be displayed.
router.get('/secret', isLoggedIn, function(req, res, next) {
  res.render('secret', { username : req.user.local.username,
    twitterName: req.user.twitter.displayName,
    signupDate: req.user.signupDate,
    favorites: req.user.favorites });
});

// This would logout and take back to the main index page, which again, has login info.
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
