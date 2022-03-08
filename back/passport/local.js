const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local"); //구조분해할때 변수명바꾸는 문법이다. 나중에 예를들어 카카오 로그인을 하려면 kakaoStrategy 이런식으로 바꿔도 무방
const { User } = require("../models");
const bcrypt = require("bcrypt");
module.exports = () => {
  //모듈의 이 부분이 index의 local()에서 실행됨
  passport.use(
    new LocalStrategy(
      {
        // 패스포트를 통한 로그인 전략은 로그인처리에 확인할 객체1개 , 이를 처리하기 위한 로직 메서드 1개로 구성된다.
        usernameField: "email", // 실제로 로그인할때 입력한 이메일 //프론트에서 data.email이었던게 서버에서는 req.body.email로 받아지고 그 email이 이거임
        passwordField: "password", // 실제로 로그인할때 입력한 비밀번호
      },
      async (email, password, done) => {
        // 실제 받은 변수명과 일치하게 열거하고 마지막에 done이 들어간다 예를들면 로그인에 id pw pw2 라는 변수가 필요하면 (id , pw , pw2 , done) 을 기입해줘야한다.
        try {
          const user = await User.findOne({
            where: { email }, //{email:email}인데 es6문법에 따라서 이렇게 줄여쓸수있음
          });
          if (!user) {
            //passport에서는 응답을 주는게 아니라 done으로 처리해준다.
            return done(null, false, { reason: "존재하지 않는 사용자입니다!" }); // 자리를 기억하자! 서버에러 / 성공 / 클라에러(보내는측에서 잘못보낸)
          }
          const result = await bcrypt.compare(password, user.password); // 사용자pw / db pw   , compare도 비동기함수라 await
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
