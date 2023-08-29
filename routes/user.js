const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const router = express.Router();

router.route('/sign-up')//로그인 및 회원가입 라우터
    .get((_, res) => {
        res.render('sign-up', {
            port: process.env.PORT
        })
    })
    .post(async (req, res, next) => {
        const { id, password, name } = req.body;
        
        if (!password) return next('비밀번호를 입력하세요.');

        const user = await User.findOne({ where: { id } });
        if (user) {
            res.send({
                result: 'fail',
                error: '이미 등록된 사용자 아이디입니다'
            })
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
  .get((req, res, next) => {
    const user = req.user;
    res.render('profile', { user });
  })
  .post(async (req, res, next) => {
    const { password, name } = req.body;

    if (!password || !name) {
      return res.send({
        result: 'fail',
        error: '모든 필드를 입력하세요.'
      });
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

  router.route('/delete')
  .post(async(req,res,next)=>{
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