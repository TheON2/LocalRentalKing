exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //passport에서 제공하는 isAuthenticated. 이게 true면 로그인된상태
    next(); //넥스트에 인자가 없으면 다음 미들웨어로
  } else {
    res.status(401).send("로그인이 필요합니다.");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인 하지 않은 사용자만 접근 가능 합니다.");
  }
};

// 로그인체크. 코드의 중복을 제거하기위해서 만든 커스텀 미들웨어
