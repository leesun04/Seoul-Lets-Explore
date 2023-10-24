const express = require('express');
const { isLoggedIn } = require('./helpers');
const Place = require('../models/place');
const router = express.Router();
const { Op } = require('sequelize');
const path = require('path'); // path 모듈 추가
const fs = require('fs'); // fs 모듈 추가


// 여행지 검색
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const searchKeyword = req.query.name;
        const page = req.query.page || 1;
        const perPage = 12;

        if (searchKeyword) {
            const { count, rows: places } = await Place.findAndCountAll({
                where: {
                    name: { [Op.like]: `%${searchKeyword}%` }
                },
                offset: (page - 1) * perPage,
                limit: perPage,
            });

            const totalTravelSpots = count;
            const totalPages = Math.ceil(totalTravelSpots / perPage);

        // UI 폴더 내 이미지 파일 경로
        const uiImageDirectory = path.join(__dirname, '..', 'UI');

        // 각 여행지에 이미지 파일을 매칭하여 이미지 데이터를 생성
            const travelSpotImages = places.map((spot) => {
            // 여행지의 tourId를 사용하여 이미지 파일 이름을 생성
            const imageFileName = `${spot.tourId}.jpg`; // 이미지 파일 확장자에 따라 조정 가능

            // 이미지 파일 경로 생성
            const imagePath = path.join(uiImageDirectory, imageFileName);

            // 이미지 파일을 읽어서 Base64로 변환
            const imageBuffer = fs.readFileSync(imagePath);
            return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
            });
                // 이미지를 읽고 클라이언트에게 전달
                res.render('searchResult', {
                    port: process.env.PORT,
                    api: 'travelSpot/info',
                    travelSpots: places.map((spot, i) => {
                        // 각 여행지 정보에 이미지 데이터 추가
                        spot.imageData = travelSpotImages[i];
                        return spot;
                    }),
                    currentPage: page,
                    totalPages: totalPages,
                });
        } else {
            // If there's no search keyword provided, render an empty searchResult page.
            res.render('searchResult', {
                port: process.env.PORT,
                api: 'travelSpot/info',
                places: [], // Send an empty array
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;
