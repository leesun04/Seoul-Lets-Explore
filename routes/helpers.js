// exports.isLoggedIn = (req, res, next) => {
//     if (req.isAuthenticated()) next();
//     else res.status(403).send({
//         result: 'fail',
//         error: '로그인이 필요합니다'
//     });
// };
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login'); // 로그인 화면으로 리다이렉트
  }
};
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) next();
    else res.redirect(`/`);
};
