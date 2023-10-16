const path = require('path');
const fs = require('fs');
const express = require('express');
const { Place } = require('../models');
const router = express.Router();
const { isLoggedIn } = require('./helpers');
const { off } = require('process');

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const page = req.query.page || 1; // 현재 페이지 번호를 가져옵니다.
        const perPage = 12; // 페이지당 표시할 여행지 수를 설정하세요.

        // 전체 여행지의 수를 가져옵니다.
        const totalTravelSpots = await Place.count();

        // 페이지 수를 계산합니다.
        const totalPages = Math.ceil(totalTravelSpots / perPage);

        // 해당 페이지에 표시할 여행지 정보를 가져옵니다.
        const offset = (page - 1) * perPage;
        
        const travelSpots = await Place.findAll({
            offset: offset,
            limit: perPage,
        });

        // 이미지 파일의 경로 설정 (여기서는 UI 폴더 내에 이미지 파일을 가정)
        const imagePath = path.join(__dirname, '..', 'UI', '서울풍경.jpg');

        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error(err);
                next(err);
            } else {
                // 이미지를 읽고 클라이언트에게 전달
                res.render('tour-list', {
                    port: process.env.PORT,
                    api: 'travelSpot/info',
                    travelSpots: travelSpots.map((v) => v),
                    imageUrl: `data:image/jpeg;base64,${data.toString('base64')}`,
                    currentPage: page,
                    totalPages: totalPages, // 전체 페이지 수를 전달
                });
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/info/:tourId', isLoggedIn, async (req, res, next) => {
    try {
        const travelSpot = await Place.findOne({
            where: { tourId: req.params.tourId }
        });

        // 이미지 파일의 경로 설정 (여기서는 UI 폴더 내에 이미지 파일을 가정)
        const imagePath = path.join(__dirname, '..', 'UI', 'aaa.jpg');

        // 이미지 파일을 읽어서 클라이언트에게 제공
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                console.error(err);
                next(err);
            } else {
                // 이미지를 읽고 클라이언트에게 전달
                res.render('tour-info', {
                    port: process.env.PORT,
                    travelSpot,
                    imageUrl: `data:image/jpeg;base64,${data.toString('base64')}` // 이미지를 Base64로 변환하여 클라이언트에게 전달
                });
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/restaurant/:tourId',isLoggedIn,async(req,res,next)=>{ //여행지 주변 식당 정보 api
    try{
        const travelSpot = await Place.findOne({
            where: {tourId:req.params.tourId}
        });
        res.render('restaurant',{
            port:process.env.PORT,
            travelSpot
        });
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;