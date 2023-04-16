const path = require('path');

const fs = require('fs')
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');

const passport = require('passport'); // passport 패키지
const passportConfig = require('./passport'); // 

const userRouter = require('./routes/user');
const reviewRouter = require('./routes/review');


dotenv.config(); // .env 파일을 읽어서 process.env로 만든다. (dotenv => dot(.) + env) 비밀 키들을 관리하기 위함.
passportConfig(); // 초기 세팅 1

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'UI'), {
    express: app,
    watch: true,
});

// app.get('/UI', function(req,res){
//     fs.readFile('하남.jpg',function(error, data){
//         res.writeHead(3000,{'Content-Type': 'main/html'});
//         res.end(data);
//     });
// })
app.use(express.static('UI'));

sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error(err));

// app.use -> 미들웨어를 사용하겠다는 의미.
// localhost:5000/
app.use(
    // 'abcd',  <= 와 같이 첫번째 인자에 경로를 지정해줄 수 있다. 그럼 주소가 바뀜 (localhost:5000/abcd)
    // 지정해주지 않으면 '/'가 디폴트 값으로 지정되어있는걸로 처리.
    morgan('dev'), // 서버에 들어온 응답과 요청을 기록해주는 미들웨어, 기록 후 next 호출
    express.static(path.join(__dirname, 'public')), // 요청하는 파일이 있을 때 파일 경로를 제공하며, localhost:5000/ 에 접속하면 public으로 경로를 바꿔줌
    express.json(), // put이나 patch, post 요청 시에 req.body에 프런트에서 온 데이터를 넣어줌
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({ // 로그인 정보를 세션으로 저장하겠다는 의미
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    })
);

// 초기 세팅 2

// passport를 사용할 수 있도록 처리를 해주는 작업 => 
// 요청 객체에 passport설정을 심음
app.use(passport.initialize());

//req.session 객체에 passport 정보를 저장함.
app.use(passport.session()); // 세션 객체의 유저정보를 저장해주는 일


app.use('/user', userRouter);
app.use

app.use((req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('main');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});