//이 파일이 패스포트 설정파일
const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  //쿠키랑 아이디랑 묶어서 저장함
  passport.serializeUser((user, done) => {
    done(null, user.id);
  }); // 쿠키에 user id를 pk로 데이터를 저장

  passport.deserializeUser(async (id, done) => {
    //디비로부터 아이디로 가져옴
    try {
      // user id를 pk로 데이터 조회
      const user = await User.findOne({ where: { id } });
      done(null, user); //db에서 꺼내온 데이터를 req.user에 입력
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  local(); // 로그인 로직 구현 파일
};
