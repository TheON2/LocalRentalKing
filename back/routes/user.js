const express = require("express");
const multer = require("multer");
const passport = require("passport");
const bcrypt = require("bcrypt"); //해쉬화 알고리즘
const fs = require("fs");
const { User, ProdPost, PowerPost, TogetherPost } = require("../models"); //User model require 26번라인 User.create를 사용하기위해서 '구조분해할당'
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
//const { format } = require("sequelize/types/utils"); //이부분 코드는?
//원래 db.User로 접근해야 하는데 {User}해놓으면 그냥 유저로 접근 가능
//const db=require('../models');이렇게 해놨으면 db.User로 접근

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}
// <--------- 프로필 이미지업로드를 위한 multer생성  -------->
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      //사진.png
      const ext = path.extname(file.originalname); //확장자추출(.png, .jpg 등)
      const basename = path.basename(file.originalname, ext); // 사진
      done(null, basename + "_" + new Date().getTime() + ext); //사진_1513515313.png (같은 이름으로 이미지를 업로드하면 노드에서는 기존파일에 덮어씌워버려서 시간까지추가해서 올리는 코드)
    },
  }),
  limits: { fileSize: 28 * 1024 * 1024 }, //20mb로 파일 업로드 크기 제한
});

// <------ 로그인 ----->
router.post("/login", isNotLoggedIn, (req, res, next) => {
  //이걸 미들웨어 확장이라고 한다. 원래 passport.authenticate는 req,res,next를 쓸수없는 미들웨어인데 그걸 확장해서 쓸수 있게하는 express기법
  passport.authenticate("local", (err, user, info) => {
    //passport전략실행 //passport의 done이 콜백같은거라 이게 여기로 전달됨
    if (err) {
      console.log(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason); //info - 클라측 에러
    }
    return req.login(user, async (loginErr) => {
      //req.login을 하면 같이 실행되는 코드는 index의 serializeUser와
      //여기서 로그인은 패스포트 로그인이다. 여기서 에러가 날 경우를 처리해주는 코드
      if (loginErr) {
        console.log(err);
        return next(loginErr);
      }
      const fullInfoUserWithoutPassword = await User.findOne({
        //비밀번호를 제외한 모든 사용자의 정보를 가지고있는 객체
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
          //비밀번호를 제외한 모든 컬럼 가져옴
        },
        include: [
          {
            model: ProdPost, //내가 쓴 게시물들
            attributes: ["id"], //내가 쓴 게시물들 숫자만 알면되고 나머지 정보는 불필요
          },
          {
            model: PowerPost,
            attributes: ["id"],
          },
          {
            model: TogetherPost,
            attributes: ["id"],
          },
        ],
      });
      //로그인할때 내부적으로 res.setHeader('Cookie','afeaf'(랜덤문자열)) 이런 걸 보내준다, 세션도 연결해주고
      return res.status(200).json(fullInfoUserWithoutPassword); // 사용자정보를 프론트로 넘겨줌
    });
  })(req, res, next);
});

// <------ 로그아웃 ----->
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req._destroy();
  res.send("ok");
});

// <------ 회원가입 ----->
router.post("/", isNotLoggedIn, async (req, res, next) => {
  //  '/'와 app.js에 있는 app.use('/user',....)->POST/user/ 사가에서 axios.post('http://localhost:3065/user/')로 요청
  try {
    const exUser = await User.findOne({
      //이메일 중복체크
      where: {
        //조건
        email: req.body.email,
      },
    });
    if (exUser) {
      //exUser가 true는 중복된 유저가 있다는 이야기
      //exUser가 null인지를 체크해야하는거아냐? findOne의 반환이 promise객체아닌가?
      return res.status(403).send("이미 사용중인 아이디입니다"); //return이 없다면 밑에 res.send가 있어서 응답을 2번보내는셈이 돼버림
    }
    const exNickname = await User.findOne({
      //닉네임 중복체크
      where: {
        email: req.body.nickname,
      },
    });
    if (exNickname) {
      return res.status(403).send("이미 사용중인 닉네임입니다");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //bcrypt로 패스워드 해쉬화, 2번째 인자는 saltRound로 높아질수록 보안은 올라가지만 속도는 느려진다.
    await User.create({
      //await이 없다면 뒤에 res.json()이 먼저 실행돼 버리기때문에 없어도 데이터는 들어가지만 순서를 맞춰주기위한 코드 await을 쓰려면 함수가 async함수여야함.
      //create는 원래 비동기 메서드. async, await는 세트로 비동기 메서드와 같이쓰임
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
      location: req.body.location,
      grade: req.body.grade,
    });
    res.status(200).send("ok");
    //res.json(); //제이슨으로 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// <------- 사용자 불러오기 (새로고침마다 요청할것)------->
router.get("/", async (req, res, next) => {
  // GET / user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// <------- 특정유저 조회 by nickname ------>
// 게시물에 통해 유저의 닉네임을
router.get("/userInfo/:nickname", async (req, res, next) => {
  // GET / user
  try {
    if (true) {
      const user = await User.findOne({
        where: { nickname: req.params.nickname },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: ProdPost, //유저가 쓴 게시물들
            //attributes: ["id"], //내가 쓴 게시물들 숫자만 알면되고 나머지 정보는 불필요  //  전체데이터 전달 필요
          },
          {
            model: PowerPost,
            //attributes: ["id"],
          },
          {
            model: TogetherPost,
            //attributes: ["id"],
          },
        ],
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//<----- 유저 정보 수정 (어떤데이터를 수정해야할지 협의 필요)----->
//  인사말, 프로필사진, 주소
router.patch("/update", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname, //프론트와 상의해서 넘겨받을 데이터 설정하기
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//-----------------------유저의 프로필 이미지 수정 ------------------------------
router.patch("/profileImage", isLoggedIn, async (req, res, next) => {
  //닉네임 수정
  try {
    const image = await User.update({ src: req.body.image });
    //await User.addUserImages(image);
    res.status(201).json(image);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//  <------ 이미지 업로드 ------>  //이건 라우터가 하나만있어도 될듯?
router.post(
  "/images",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    console.log(req.files); //업로드된 이미지 정보
    res.json(req.files.map((v) => v.filename)); //어디로 업로드되었는지에 대한 정보를 프론트에 전달
  }
);

//  <------ findAll test ----->
router.get("/findAll", (req, res) => {
  //axios.get('http://localhost:3065/user/findAll')
  User.findAll().then((result) => {
    //findAll메서드 인자에 { raw : true }옵션을 추가하면 dataValues만 리턴 - 이러면 result가 비어있는 어레이객체로 반환됨
    console.log(result);
    //res.send(result); 이렇게 보내니까  postman에서 json배열로 받아지는데?
  });
});

//  <------ findOne test ----->
router.get("/findOne", (req, res) => {
  //axios.get('http://localhost:3065/user/findOne')
  User.findAll({
    where: {
      id: 2,
    },
  }).then((result) => {
    // then이란건 promise가 정상적으로 잘수행이 되어서 최종적으로 resolve라는 콜백함수로 전달한 값이 들어가있음
    //만약에 error가 발생했다면 rejected라는 함수를 통해서 new한 error객체를 보내준다
    //promise객체에 then이 호출이되면 다시 promise가 반환되기때문에 이 뒤로 catch같은 체이닝을 걸어줄수있음
    console.log(result);
    res.send(result);
  });
});

module.exports = router;

// 특정 필드(Column) [attributes 옵션 사용]
// /* SQL */
// SELECT name, married FROM users;
// ​
// /* 시퀄라이즈 */
// User.findAll({
//   attributes: ['name', 'married']
// });
