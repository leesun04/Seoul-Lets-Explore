const path = require('path');
const express = require('express');
const { isLoggedIn } = require('./helpers');
const { TravelSpot } = require('../models');
const router = express.Router();

router.get('/', isLoggedIn, async(req,res,next)=>{
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

router.get('/info/:tourId', async(req,res,next) => {
    try{
        const travelSpot = await TravelSpot.findOne({
            where: {tourId: req.params.tourId}
        });
        res.render('tour-info',{
            travelSpot,
            prot: process.env.PORT
        });
        // res.json('tour-info',{
        //     result: "success",
        //     message: "하나의 관광지 정보 조회에 성공했습니다",
        //     travelSpot
        // });
    }catch(err){
        console.error(err)
        next(err)
    }
});

module.exports = router;