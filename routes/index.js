var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/saveSecrets', isLoggedIn, function(req, res, next){

  // Check if the user has provided any new data
  if (!req.body.color && !req.body.luckyNumber) {
    req.flash('updateMsg', 'Please enter some new data');
    return res.redirect('/secret')
  }

  //Collect any updated data from req.body, and add to req.user

  if (req.body.color) {
    req.user.favorites.color = req.body.color;
  }
  if (req.body.luckyNumber) {
    req.user.favorites.luckyNumber = req.body.luckyNumber;
  }

  //And save the modified user, to save the new data.
  req.user.save(function(err) {
    if (err) {
      if (err.name == 'ValidationError') {
        req.flash('updateMsg', 'Error updating, check your data is valid');
      }
      else {
        return next(err);  // Some other DB error
      }
    }

    else {
      req.flash('updateMsg', 'Updated data');
    }

    //Redirect back to secret page, which will fetch and show the updated data.
    return res.redirect('/secret');
  })
});

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

router.get('/secret', isLoggedIn, function(req, res, next) {
  res.render('secret', { username : req.user.local.username,
    twitterName: req.user.twitter.displayName,
    signupDate: req.user.signupDate,
    favorites: req.user.favorites });
});

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
