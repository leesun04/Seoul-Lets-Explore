const express = require('express');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('./helpers');
const router = express.Router();
const { Plan, User } = require('../models');

// 기본 페이지 렌더링
router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        // 이미지 로드 및 렌더링
        const imagePath = path.join(__dirname, '..', 'UI', '잠실벚꽃.jpg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        const userId = req.user.userId;
        console.log(userId)
        const plans = await Plan.findAll({
            where: { userId }
        });
        res.render('tour', {
            port: process.env.PORT,
            imageUrl: imageUrl,
            userId, 
            plans: plans
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 여행 계획 저장
router.post('/save-travel-plan', isLoggedIn, async (req, res, next) => {
    try {
        const { planName, planContent, planStart, planEnd } = req.body;

        const userId = req.user.userId;

        const newPlan = await Plan.create({
            planName,
            planContent,
            start: planStart,
            end: planEnd,
            userId,
        });
        res.json({ success: true, message: '일정이 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: '일정 저장 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
