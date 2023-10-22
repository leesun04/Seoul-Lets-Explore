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

            // UI 폴더 내 이미지 파일 가져오기
            const uiFolder = path.join(__dirname, '..', 'UI');
            fs.readdir(uiFolder, (err, files) => {
                if (err) {
                    console.error(err);
                    next(err);
                    return;
                }
                // 이미지 파일 목록 필터링 (예: .jpg, .jpeg, .png, .gif 파일 등)
                const imageFiles = files.filter(file => {
                    const fileExtension = path.extname(file).toLowerCase();
                    return ['.jpg'].includes(fileExtension);
                });

                // 각 여행지에 이미지 파일을 매칭하여 이미지 데이터를 생성
                const travelSpotImages = places.map((place, index) => {
                    // 이미지 파일을 무작위로 선택하거나 다른 방식으로 매칭
                    const randomImageFileName = imageFiles[index % imageFiles.length];
                    const imagePath = path.join(uiFolder, randomImageFileName);
                    const imageBuffer = fs.readFileSync(imagePath);
                    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
                    return base64Image;
                });

                // 이미지를 읽고 클라이언트에게 전달
                res.render('searchResult', {
                    port: process.env.PORT,
                    api: 'travelSpot/info',
                    places: places.map((place, i) => {
                        // 각 여행지 정보에 이미지 데이터 추가
                        place.imageData = travelSpotImages[i];
                        return place;
                    }),
                    currentPage: page,
                    totalPages: totalPages,
                });
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
