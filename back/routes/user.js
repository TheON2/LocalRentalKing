const express = require("express");
const bcrypt = require("bcrypt"); //암호화 위한 모듈
const { User } = require("../models"); //모델스에 만들어놓은 유저를 쓰겠음 인덱스에서db로 익스포트 했으니까
const { format } = require("sequelize/types/utils");
//원래 db.User로 접근해야 하는데 {User}해놓으면 그냥 유저로 접근 간으
//const db=require('../models');이렇게 해놨으면 db.User로 접근

const router = express.Router();

router.post("/", async (req, res) => {
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
      nickname: req.body.nickname,
      password: hashedPassword,
      location: req.body.location,
      greeting: req.body.greeting,
      grade: req.body.grade,
      profileImgSrc: req.body.profileImgSrc,
    });
    res.status(200).send("ok");
    //res.json(); //제이슨으로 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/findAll", (req, res) => {
  //axios.get('http://localhost:3065/user/findAll')
  User.findAll().then((result) => {
    console.log(result);
  });

  //'/'랑 앱js에 있는 app.use('/user',....)->POST/user/ 사가에서 axios.post('http://localhost:3065/user/1234')
});

router.get("/findOne", (req, res) => {
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
