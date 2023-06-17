const express = require('express');
// const passport = require('passport');
// const path = require('path');
const router = express.Router();

router.get('/', (req, res,next) => {
    res.render('map');
  });

module.exports = router;