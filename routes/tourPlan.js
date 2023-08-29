const express = require('express');
const { isLoggedIn } = require('./helpers');
const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        res.render('tour', {
            port: process.env.PORT,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
