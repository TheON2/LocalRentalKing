const express = require("express");
const db = require("./models");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan"); //프론트에서 백엔드로 어떤요청들을 보냈는지 로그를 띄워줌
const passportConfig = require("./passport");

const passport = require("passport");
const dotenv = require("dotenv");
const path = require("path");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post"); //게시글 1개만 컨트롤하는 라우터 (게시글 1개를 작성하고, 조회하고~)
const postsRouter = require("./routes/posts"); //게시글 여러개를 컨트롤하기위한 라우터

dotenv.config(); // dotenv를 활성화 시키며 dotenv에 들어간 상수들이 import 된다.

const app = express(); //express() 메소드 호출로 생성되는 익스프레스 서버 객체
// 이 서버객체는 set(name, value) - 서버설정을 위한 속성지성 , get(name) - 서버 설정으로 지정한 속성을꺼내온다.
// use([path,] function, [, function...]) - 미들웨어 함수사용 , get([path,] function)특정 경로로 요청된 정보를 처리 등의 메서드를 가지고있다.

db.sequelize
  .sync({ force: false }) // sync메서드를 사용하면 서버 실행 시 MySQL과 연동되도록 할수있다.
  // 괄호안에 { force: true } 옵션을 설정해주면 서버 실행 시마다 테이블을 재생성한다. (테이블을 잘못만든경우 true로 바꿔주자)
  .then(() => {
    //promise라서 then
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(morgan("dev")); //미들웨어 함수사용
app.use(
  cors({
    origin: "http://localhost:3000", //Access-Control-Allow-Origin
    credentials: true, //기본값은 false고 쿠키도 전달하고싶으면 true로 바꿔줘야함
  })
);

app.use("/", express.static(path.join(__dirname, "uploads")));
// "/" =  localhost3065 = 백서버의 도메인
// 폴더명(경로)을 각OS에 최적화 하기 위해 - windows는 경로가 '\' , mac은 '/'
// join으로 주소를 결합한다.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //url방식 폼 요청 들어오면 파싱

app.use(cookieParser());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize()); //요청 (req 객체) 에 passport 설정을 심는다.
app.use(passport.session()); //req.session 객체에 passport 정보를 저장
//req.session 객체는 express-session에서 생성하니까 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야한다.

app.use("/user", userRouter); //user가 prefix로 붙는다
app.use("/post", postRouter);
app.use("/posts", postsRouter);

app.listen(3065, () => {
  console.log("서버 실행중");
});
