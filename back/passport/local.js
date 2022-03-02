//로그인 전략을 세우는곳
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        // 패스포트를 통한 로그인 전략은 로그인처리에 확인할 객체1개 , 이를 처리하기 위한 로직 메서드 1개로 구성된다.
        usernameField: "email", // 실제로 로그인할때 입력한 이메일
        passwordField: "password", // 실제로 로그인할때 입력한 비밀번호
      },
      async (email, password, done) => {
        // 실제 받은 변수명가 일치하게 열거하고 마지막에 done이 들어간다 예를들면 로그인에 id pw pw2 라는 변수가 필요하면 (id , pw , pw2 , done) 을 기입해줘야한다.
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 사용자입니다!" }); // 서버에러 / 성공 / 클라에러
          }
          const result = await bcrypt.compare(password, user.password); // 사용자pw / db pw
          if (result) {
            return done(null, user); //db에서 꺼내온 데이터를 req.user에 입력
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
