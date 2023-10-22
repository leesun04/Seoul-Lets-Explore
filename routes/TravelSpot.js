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
            res.render('tour-list', {
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