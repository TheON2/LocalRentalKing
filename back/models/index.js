const Sequelize = require("sequelize");
const comment = require("./comment");
const image = require("./image");
const post = require("./post");
const user = require("./user");

const env = process.env.NODE_ENV || "development"; //process.env.NODE_ENV가 기본적으로 development이기 때문에 development의 환결설정을 불러옴 (추후 배포시 "production"으로 설정)
const config = require("../config/config")[env]; //config/config.json 파일에 있는 설정값들이 담긴다 데이터베이스 설정을 이 파일에서 불러온 후에 (1)
const db = {};

const sequelize = new Sequelize( //(2)여기서 시퀄라이즈를 new해서 mysql연결객체를 생성한다.
  config.database,
  config.username,
  config.password,
  config
);

db.Comment = comment; //db객체에 각각의 모델들을 저장ㅡ 앞으로 db객체를 require하여서 각각의 모델들에 접근할수있게된다.
db.Image = image;
db.Post = post;
db.User = user;

Object.keys(db).forEach((modelName) => {
  //이부분 코드 설명 부탁?  db에 모델들 담았고 foreach로 model 갯수만큼 for문돌아서 각각의 모델의 static.init 메서드를 호출하는건가?  - init이 실행되어야 테이블이 모델로 연결된다.
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  //미리 associate
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; //위에서 생성한 연결객체를 재 사용하기위해 db.sequelize에 넣어둔다
db.Sequelize = Sequelize;

module.exports = db;
