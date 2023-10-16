const express = require('express');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('./helpers');
const router = express.Router();
const { Plan, User } = require('../models'); // 모델 이름은 'Plan'으로 가정합니다.

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        // 이미지 파일을 읽고 Base64로 인코딩하여 HTML로 전달
        const imagePath = path.join(__dirname, '..', 'UI', '잠실벚꽃.jpg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        res.render('tour', {
            port: process.env.PORT,
            imageUrl: imageUrl,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/save-travel-plan', isLoggedIn, async (req, res, next) => {
    try {
        const { planName, planContent, planStart, planEnd } = req.body; // 수정: 시작일과 종료일 필드 이름 변경

        const userId = req.user.userId; // 현재 로그인한 사용자의 아이디

        // 여행 일정을 DB에 저장
        const newPlan = await Plan.create({
            planName,
            planContent,
            start: planStart, // 수정: 클라이언트에서 전달된 시작 날짜
            end: planEnd, // 수정: 클라이언트에서 전달된 종료 날짜
            userId,
        });

        // 성공 응답
        res.json({ success: true, message: '일정이 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: '일정 저장 중 오류가 발생했습니다.' });
    }
});


module.exports = router;