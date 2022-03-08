const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    //local.js에서 리턴한 req.login의 정보가 첫번째인자로 들어감
    done(null, user.id);
  }); // 쿠키에 user id를 pk로 데이터를 저장

  passport.deserializeUser(async (id, done) => {
    try {
      // user id를 pk로 데이터 조회
      const user = await User.findOne({ where: { id } });
      done(null, user); //deserializeUser로 정보를 복구(id로 조회)해서 req.user에 넣어줌
    } catch (error) {
      console.error(error);
      done(error);
    }
  });
  local(); // 로그인 로직 구현 파일, local.js에서 module.export 한 부분
};

//서버에 사용자 정보를 다 가지고있으면 무거우니까 로그인을하면 serializeUser를 통해서 쿠키에 id값만 연결
//이후 라우터에 접근을하면 라우터접근전에 deserializeUser를 한번씩실행해서
//저장해놨던 id값을 토대로 db조회해서 사용자 정보 복구.
//req.user로 만들어줌.
//이것때문에 후에 라우터에서 req.user.id 등으로 접근이 가능함
