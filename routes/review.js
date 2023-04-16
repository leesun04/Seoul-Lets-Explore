const path = require('path');
const express = require('express');
const { isLoggedIn } = require('./helpers');
const { Review, TravelSpot } = require('../models');
const { json } = require('sequelize');
const router = express.Router();

// localhost:5000/review/show
//관광지 정보
router.get('/show',async(req,res,next)=>{
    try{
        const travelSpots = await TravelSpot.findAll({});
        res.render('review',{
            port: process.env.PORT,
            travelSpots: travelSpots.map(v => v)
        })
    }catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/show/:tourId', async(req,res,next)=>{
    try {
        const reviews = await Review.findAll({
            where: { tourId: req.params.tourId }
        });
        res.render('review/review-show', {
            reviews: reviews.map(v => v),
            port: process.env.PORT,
            userId: req.user.userId
        })
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;