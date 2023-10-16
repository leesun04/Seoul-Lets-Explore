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

        if (searchKeyword) {
            const places = await Place.findAll({
                where: {
                    name: { [Op.like]: `%${searchKeyword}%` }
                }
            });

            // 이미지 파일의 경로 설정 (여기서는 UI 폴더 내에 이미지 파일을 가정)
            const imagePath = path.join(__dirname, '..', 'UI', '서울풍경.jpg');

            // Log the found places
            console.log('Found Travel Spots:');
            places.forEach(place => {
                console.log(`Name: ${place.name}, Tour ID: ${place.tourId}`);
            });

            // 여행지 검색 결과를 searchResult 페이지로 렌더링
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    console.error(err);
                    next(err);
                } else {
                    // 이미지를 읽고 클라이언트에게 전달
                    res.render('searchResult', {
                        port: process.env.PORT,
                        api: 'travelSpot/info',
                        places: places.map((v) => v), 
                        imageUrl: `data:image/jpeg;base64,${data.toString('base64')}`,
                        searchKeyword
                    });
                }
            });
        } else {
            // 검색어가 제공되지 않은 경우, 여행지 목록을 표시하지 않습니다.
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
