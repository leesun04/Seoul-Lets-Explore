const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const { isLoggedIn } = require('./helpers');
const router = express.Router();

router.route('/sign-up')//로그인 및 회원가입 라우터
    .get((_, res) => {
      const imagePath = path.join(__dirname, '..', 'UI', '서울풍경.jpg');
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        res.render('sign-up', {
            port: process.env.PORT,
            imageUrl: imageUrl
        })
    })
    .post(async (req, res, next) => {
        const { id, password, name } = req.body;
        
        if (!id){
          return res.redirect('/user/sign-up?error=아이디를 입력하세요');
        }
        if (!password){
          return res.redirect('/user/sign-up?error=비밀번호를 입력하세요');
        }
        if (!name){
          return res.redirect('/user/sign-up?error=이름을 입력하세요');
        }
        const user = await User.findOne({ where: { id } });
        if (user) {
          // 이미 등록된 사용자 아이디인 경우, 오류 메시지를 포함하여 리다이렉트
          return res.redirect('/user/sign-up?error=이미 등록된 사용자 아이디입니다');
      }

        try {
            const hash = await bcrypt.hash(password, 12);
            const user = await User.create({
                id,
                password: hash,
                name
            });
            res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })

// localhost:5000/user/login
// 서버 코드
router.post('/login', (req, res, next) => {//로그인값 라우터

    passport.authenticate('local', (authError, user, info) => {
      if (user) {
        req.login(user, loginError => {
          // 로그인 성공 시 result 값을 'true'로 설정하고 메인 페이지로 이동
          res.cookie('result', 'true');
          res.redirect('/');
        });
      } else {
        // 로그인 실패 시 result 값을 'false'로 설정하고 다시 로그인 페이지로 이동
        res.cookie('result', 'false');
        res.redirect('/login');
      }
    })(req, res, next);
  });
  

// localhost:5000/user/logout
router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// localhost:5000/user/kakao
router.get('/kakao', passport.authenticate('kakao'));

// localhost:5000/user/kakao/callback
router.get('/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

router.route('/profile') // 사용자 정보 수정 라우터
  .get(isLoggedIn,(req, res, next) => {
    const imagePath = path.join(__dirname, '..', 'UI', '빌딩불꽃.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    const user = req.user;
    res.render('profile', { 
      user,
      imageUrl: imageUrl
    });
  })
  .post(isLoggedIn,async (req, res, next) => {
    const { password, name } = req.body;

    if (!password || !name) {
      return res.redirect('/user/profile?error=빈칸이 있습니다.');
    }

    try {
      const user = req.user;
      if (password) {
        const hash = await bcrypt.hash(password, 12);
        user.password = hash;
      }

      if (name) {
        user.name = name;
      }
      await user.save();
      res.redirect('/page/');
    } catch (err) {
      console.error(err);
      next(err);  
    }
  });

  //router.post('/delete')//사용자 탈퇴 
  router.get('/delete',async(req,res,next)=>{
    const user = req.user;
    try{
      await User.destroy({where: {id:user.id}});
      req.logout();
      req.session.destroy();
      res.redirect('/')
    }
    catch(err){
      console.log(err);
      next(err);
    }
  })


module.exports = router;