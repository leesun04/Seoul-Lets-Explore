const express = require('express');
const router = express.Router();
const { Cart,CartTravelSpot,User } = require('../models');
const { isLoggedIn } = require('./helpers');
const { route } = require('./TravelSpot');

router.get('/', isLoggedIn, async(req,res,next)=>{//장바구니 메인 화면
    try{
        const carts = await Cart.findAll({});
        res.render('cart-main',{//장바구니 목록 확인
            port: process.env.PORT,
            api: 'cart/info',
            carts: carts.map(v=>v)
        });
        console.log(carts)
    }catch(err){
        console.error(err)
        next(err)
    }
});
router.post('/add-to-cart/:tourId', isLoggedIn, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.userId; // 로그인된 사용자의 DB ID
    const tourId = req.params.tourId; // 추가할 여행지의 ID

    // 장바구니에 여행지 추가하는 로직 구현
    await CartTravelSpot.create({
      cartId: userId, // 로그인된 사용자의 ID를 장바구니 ID로 사용
      tourId: tourId // 추가할 여행지의 ID
    });

    res.redirect('/'); // 장바구니 페이지로 리다이렉트

  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;