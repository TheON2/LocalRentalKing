const express = require("express");
const db = require("./models");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors"); //콜스
const morgan = require("morgan");
const path = require("path");
const passportConfig = require("./passport");

const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config(); // dotenv를 활성화 시키며 dotenv에 들어간 상수들이 import 된다.

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(morgan("dev"));
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   }
// ));

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

app.use("/", express.static(path.join(__dirname, "uploads"))); //__dirname->현재폴더+uploads경로를 합쳐줌
// localhost3065 = 백서버의 도메인을 위해 '/' 을 붙여주고 각OS에 경로를 최적화 하기 위해
// join으로 주소를 결합한다.
app.use(express.static(path.join(__dirname, "uploads"))); //프론트에서 사진 이미지 미리보기 하기 위해서 백엔드서버에 접속하는것을 허용함
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET)); //쿠ㅠ키파서 안에 추가했음
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);

app.listen(3065, () => {
  console.log("서버 실행중");
});
