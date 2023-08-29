const express = require('express');
const { isLoggedIn } = require('./helpers');
const User = require('../models/user');
const router = express.Router();

router.get('/',isLoggedIn,async(req,res,next)=>{//사용자 페이지 메인 화면
    try{
        const userId = req.user.id;
        const user = await User.findOne({
            where: {id: userId},
            attributes: ['name','id']
        })
        res.render('user-page',{
            port: process.env.PORT,
            user
        })
    }catch(err){
        console.error(err);
        next(err)
    }
});

module.exports = router;