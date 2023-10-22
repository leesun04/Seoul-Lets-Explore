const express = require('express');
const { isLoggedIn } = require('./helpers');
const User = require('../models/user');
const router = express.Router();
const fs = require('fs');
const path = require('path');


router.get('/',isLoggedIn,async(req,res,next)=>{//사용자 페이지 메인 화면
    const imagePath = path.join(__dirname, '..', 'UI', '빌딩불꽃.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    try{
        const userId = req.user.id;
        const user = await User.findOne({
            where: {id: userId},
            attributes: ['name','id']
        })
        res.render('user-page',{
            port: process.env.PORT,
            user,
            imageUrl: imageUrl
        })
    }catch(err){
        console.error(err);
        next(err)
    }
});

module.exports = router;