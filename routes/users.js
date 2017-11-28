var express = require('express');
var router = express.Router();

// Specific user information regarding color and number go through this route.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
