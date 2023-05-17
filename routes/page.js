const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const { isLoggedIn } = require('./helpers');
const User = require('../models/user');
const router = express.Router();

router.get('/',isLoggedIn,async(req,res,next)=>{//사용자 페이지 메인 화면
    try{
        
    }catch(err){
        console.error(err);
        next(err)
    }
});

router.get('/profile', isLoggedIn,async(req,res,next)=>{//사용자 정보 페이지
    try{
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: { exclude: ['password'] }, // 비밀번호는 제외하고 가져옴
        });
    }catch(err){
        console.error(err);
        next(err)
    }
});

module.exports = router;