const path = require('path');
const express = require('express');
const { TravelSpot,Cart } = require('../models');
const router = express.Router();
const { isLoggedIn } = require('./helpers');

router.get('/', isLoggedIn, async(req,res,next)=>{//여행지 리스트 전부를 불러오는 기능
    try{
        const travelSpots = await TravelSpot.findAll({});
        res.render('tour-list',{
            port: process.env.PORT,
            api: 'travelSpot/info',
            travelSpots: travelSpots.map(v=>v)
        });
    }catch(err){
        console.error(err)
        next(err)
    }
});

router.get('/info/:tourId', async(req,res,next) => {//선택된 여행지의 정보를 보여주는 기능
    try{
        const travelSpot = await TravelSpot.findOne({
            where: {tourId: req.params.tourId}
        });
        res.render('tour-info',{
            port: process.env.PORT,
            travelSpot       
        });
    }catch(err){
        console.error(err)
        next(err)
    }
});

module.exports = router;