const path = require('path');
const fs = require('fs');
const express = require('express');
const { Place } = require('../models');
const router = express.Router();
const { isLoggedIn } = require('./helpers');
const { Sequelize } = require('sequelize');

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const travelSpots = await Place.findAll({ order: Sequelize.literal('rand()'), limit: Math.floor(Math.random() * 5) + 5 });

        // UI 폴더 내 모든 이미지 파일 가져오기
        const uiFolder = path.join(__dirname, '..', 'UI');
        const imagePath = path.join(__dirname, '..', 'UI', '호돌이.jpg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
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
            const travelSpotImages = [];
            travelSpots.forEach((spot, index) => {
                // 이미지 파일을 무작위로 선택하거나 다른 방식으로 매칭
                const randomImageFileName = imageFiles[index % imageFiles.length];
                const imagePath = path.join(uiFolder, randomImageFileName);
                const imageBuffer = fs.readFileSync(imagePath);
                const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
                travelSpotImages.push(base64Image);
            });

            // Log the names of the travel spots
            travelSpots.forEach((spot) => {
                console.log(spot.name);
            });

            // 이미지를 읽고 클라이언트에게 전달
            res.render('commend', {
                imageUrl: imageUrl,
                port: process.env.PORT,
                api: 'travelSpot/info',
                travelSpots: travelSpots.map((v, i) => {
                    // 각 여행지 정보에 이미지 데이터 추가
                    v.imageData = travelSpotImages[i];
                    return v;
                }),
            });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/commendList', isLoggedIn, async (req, res, next) => {
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
        // UI 폴더 내 모든 이미지 파일 가져오기
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
            const travelSpotImages = [];
            travelSpots.forEach((spot, index) => {
                // 이미지 파일을 무작위로 선택하거나 다른 방식으로 매칭
                const randomImageFileName = imageFiles[index % imageFiles.length];
                const imagePath = path.join(uiFolder, randomImageFileName);
                const imageBuffer = fs.readFileSync(imagePath);
                const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
                travelSpotImages.push(base64Image);
            });

            // 이미지를 읽고 클라이언트에게 전달
            res.render('commendList', {
                port: process.env.PORT,
                api: 'travelSpot/info',
                travelSpots: travelSpots.map((v, i) => {
                    // 각 여행지 정보에 이미지 데이터 추가
                    v.imageData = travelSpotImages[i];
                    return v;
                }),
                currentPage: page,
                totalPages: totalPages,
            });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
