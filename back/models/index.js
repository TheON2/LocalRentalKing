const Sequelize = require("sequelize"); //Sequelize(대문자S) 시퀄라이즈 패키지이자 생성자
const prodPostComment = require("./prodPostComment");
const powerPostComment = require("./powerPostComment");
const togetherPostComment = require("./togetherPostComment");
const prodPostImage = require("./prodPostImage");
const powerPostImage = require("./powerPostImage");
const togetherPostImage = require("./togetherPostImage");
const prodPost = require("./prodPost");
const powerPost = require("./powerPost");
const togetherPost = require("./togetherPost");
const user = require("./user");
const message = require("./message");

const env = process.env.NODE_ENV || "development"; //process.env.NODE_ENV가 기본적으로 development이기 때문에 development의 환결설정을 불러옴 (추후 배포시 "production"으로 설정)
const config = require("../config/config")[env]; //config/config.json 파일에 있는 설정값들이 담긴다 데이터베이스 설정을 이 파일에서 불러온 후에 (1) , env안에 development가 담겼으니까 config json중 development부분이 가져와진다
const db = {}; //빈객체두고

const sequelize = new Sequelize( //(2)여기서 시퀄라이즈를 new해서 mysql연결객체를 생성한다. //이 sequelize객체에 연결정보가담김
  config.database,
  config.username,
  config.password,
  config
);

//db객체에 각각의 모델들을 저장ㅡ 앞으로 db객체를 require하여서 각각의 모델들에 접근할수있게된다.
db.ProdPost = prodPost;
db.PowerPost = powerPost;
db.TogetherPost = togetherPost;
db.ProdPostImage = prodPostImage;
db.PowerPostImage = powerPostImage;
db.TogetherPostImage = togetherPostImage;
db.ProdPostComment = prodPostComment;
db.PowerPostComment = powerPostComment;
db.TogetherPostComment = togetherPostComment;
db.User = user;
db.Message = message;

Object.keys(db).forEach((modelName) => {
  //db에 모델들 담았고 foreach로 model 갯수만큼 for문돌아서 각각의 모델의 static.init 메서드를 호출하는건가?  - init이 실행되어야 테이블이 모델로 연결된다.
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  //반복문돌면서 미리 associate
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; //위에서 생성한 연결객체를 재 사용하기위해 db.sequelize에 넣어둔다
db.Sequelize = Sequelize; //대문자 시퀄라이즈는 뭐지? - 1번라인

module.exports = db;
