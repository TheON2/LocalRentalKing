const express = require("express");
const bcrypt = require("bcrypt"); //암호화 위한 모듈
const passport = require("passport");
const { User } = require("../models"); //모델스에 만들어놓은 유저를 쓰겠음 인덱스에서db로 익스포트 했으니까
//const { format } = require("sequelize/types/utils");
//원래 db.User로 접근해야 하는데 {User}해놓으면 그냥 유저로 접근 간으
//const db=require('../models');이렇게 해놨으면 db.User로 접근
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

//--------------------로그인------------------------------------
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      crossOriginIsolated.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(user); //사용자 정보를 프론트로 넘겨줌
    });
  })(req, res, next);
}); //전략이 실행됨

//-------------------로그아웃-------------------------------------
router.post("/logout", isLoggedIn, (req, res) => {
  //"/user/logout"
  //로그아웃
  console.log(req.user);
  req.logout();
  req.session.destroy();
  res.send("ok");
});

//-----------------------유저의 닉네임 수정------------------------------
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  //닉네임 수정
  try {
    //const nickname2=req.body.nickname;
    const exNick = await User.findOne({
      //들어온 닉네임이 중복인지 확인
      where: {
        nickname: req.body.nickname,
      },
    });
    if (exNick) {
      //엑스Nick 있다면 이미 사용중인 닉네임이라는
      return res.status(403).send("이미 사용중인 닉네임 입니다");
    }
    await User.update(
      {
        nickname: req.body.nickname, //프론트에서 받아온 닉네임으로 디비에 저장되어있는 닉네임이랑 바꿈
      },
      {
        where: { id: req.user.id }, //user의 id와 나의 id가 일치해야지 바꿀수있음
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//-----------------------유저의 패스워드 수정------------------------------
router.patch("/password", isLoggedIn, async (req, res, next) => {
  //닉네임 수정
  try {
    const exNick = await User.findOne({
      //들어온 닉네임이 중복인지 확인
      where: {
        nickname: req.body.nickname,
      },
    });
    if (exNick) {
      //엑스Nick 있다면 이미 사용중인 닉네임이라는
      return res.status(403).send("이미 사용중인 닉네임 입니다");
    }
    await User.update(
      {
        nickname: req.body.nickname, //프론트에서 받아온 닉네임으로 디비에 저장되어있는 닉네임이랑 바꿈
      },
      {
        where: { id: req.user.id }, //user의 id와 나의 id가 일치해야지 바꿀수있음
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//-----------------------유저의 로케이션 수정------------------------------
router.patch("/location", isLoggedIn, async (req, res, next) => {
  //닉네임 수정
  try {
    await User.update(
      {
        location: req.body.location, //프론트에서 받아온 닉네임으로 디비에 저장되어있는 닉네임이랑 바꿈
      },
      {
        where: { id: req.user.id }, //user의 id와 나의 id가 일치해야지 바꿀수있음
      }
    );
    res.status(200).json({ location: req.body.location });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//-----------------------유저의 프로필 이미지 수정------------------------------
router.patch("/location", isLoggedIn, async (req, res, next) => {
  //닉네임 수정
  try {
    await User.update(
      {
        location: req.body.location, //프론트에서 받아온 닉네임으로 디비에 저장되어있는 닉네임이랑 바꿈
      },
      {
        where: { id: req.user.id }, //user의 id와 나의 id가 일치해야지 바꿀수있음
      }
    );
    res.status(200).json({ location: req.body.location });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//=====================회원가입==================================
router.post("/", async (req, res) => {
  //회원가입
  //'/'랑 앱js에 있는 app.use('/user',....)->POST/user/ 사가에서 axios.post('http://localhost:3065/user/')
  try {
    const exUser = await User.findOne({
      //들어온 이메일이 중복인지 아닌지 체크
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      //엑스 유저가 있다면 이미 있다는 소리기 때문에
      return res.status(403).send("이미 사용중인 아이디입니다");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //비크립트 이용해서 패스워드를 암호화(해쉬화)해서 hashedPassword에 저장
    await User.create({
      //크리에이트는 비동기 메소드? 기 때문에 어웨이트 어싱크 해줘야함
      email: req.body.email,
      password: hashedPassword,
      nickname: req.body.nickname,
      location: req.body.location,
      // greeting: req.body.greeting,
      // grade: req.body.grade,
      // profileImgSrc: req.body.profileImgSrc,
    });
    res.status(200).send("ok");
    //res.json(); //제이슨으로 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//========================테스트용===========================================================
router.get("/findAll", (req, res) => {
  //테스트용
  //axios.get('http://localhost:3065/user/findAll')
  User.findAll().then((result) => {
    console.log(result);
  });

  //'/'랑 앱js에 있는 app.use('/user',....)->POST/user/ 사가에서 axios.post('http://localhost:3065/user/1234')
});

router.get("/findOne", (req, res) => {
  //테스트용
  //axios.get('http://localhost:3065/user/findOne')
  User.findAll({
    where: {
      greeting: "hihi2",
    },
  }).then((result) => {
    console.log(result);
    console.log("ttttttttttttt" + result[1].nickname);
  });

  //'/'랑 앱js에 있는 app.use('/user',....)->POST/user/ 사가에서 axios.post('http://localhost:3065/user/1234')
});

module.exports = router;
