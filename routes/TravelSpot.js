const path = require('path');
const express = require('express');
const { TravelSpot,Cart } = require('../models');
const router = express.Router();
const { isLoggedIn } = require('./helpers');
const { off } = require('process');

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

router.get('/', isLoggedIn, async(req,res,next)=>{//메인페이지 페이지네이션
    try{
        const page = parseInt(req.query.page) || 1; //현재 페이지 번호
        const pageSize = 50; //페이지당 여행 수
        const offset = (page-1) * pageSize; //목록에서 시작할 여행지 인덱스

        const totalSpots = await TravelSpot.count();//전체 여행지 수 계산
        const spots = await TravelSpot.findAll({
            offset: offset,
            limit: pageSize
        });

        res.render('tour-list',{
            port: process.env.PORT,
            api: 'travelSpot/info',
            spots: spots.map(v=>v),
            currentPage: page,
            totalPages: Math.ceil(totalSpots/pageSize) //전체 페이지수 계산
        });
    }catch(err){
        console.error(err)
        next(err)
    };
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