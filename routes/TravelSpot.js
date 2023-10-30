const path = require('path');
const fs = require('fs');
const express = require('express');
const { Place } = require('../models');
const router = express.Router();
const { isLoggedIn } = require('./helpers');
const { off } = require('process');

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const perPage = 12;

        const totalTravelSpots = await Place.count();
        const totalPages = Math.ceil(totalTravelSpots / perPage);

        const offset = (page - 1) * perPage;
        const travelSpots = await Place.findAll({
            offset: offset,
            limit: perPage,
        });

        // UI 폴더 내 이미지 파일 경로
        const uiImageDirectory = path.join(__dirname, '..', 'UI');

        // 각 여행지에 이미지 파일을 매칭하여 이미지 데이터를 생성
        const travelSpotImages = travelSpots.map((spot) => {
            // 여행지의 tourId를 사용하여 이미지 파일 이름을 생성
            const imageFileName = `${spot.tourId}.jpg`; // 이미지 파일 확장자에 따라 조정 가능

            // 이미지 파일 경로 생성
            const imagePath = path.join(uiImageDirectory, imageFileName);

            // 이미지 파일을 읽어서 Base64로 변환
            const imageBuffer = fs.readFileSync(imagePath);
            return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        });

        // 이미지를 읽고 클라이언트에게 전달
        res.render('tour-list', {
            port: process.env.PORT,
            api: 'travelSpot/info',
            travelSpots: travelSpots.map((spot, i) => {
                // 각 여행지 정보에 이미지 데이터 추가
                spot.imageData = travelSpotImages[i];
                return spot;
            }),
            currentPage: page,
            totalPages: totalPages,
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

        // UI 폴더 내 이미지 파일 경로
        const uiImageDirectory = path.join(__dirname, '..', 'UI');
        
        // 이미지 파일 이름 생성 (tourId.jpg)
        const imageFileName = `${travelSpot.tourId}.jpg`;

        // 이미지 파일 경로 생성
        const imagePath = path.join(uiImageDirectory, imageFileName);

        // 이미지 파일을 읽어서 Base64로 변환
        const imageBuffer = fs.readFileSync(imagePath);
        const imageData = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        res.render('tour-info', {
            port: process.env.PORT,
            travelSpot,
            travelSpotImage: imageData
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;