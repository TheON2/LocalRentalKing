const Sequelize = require("sequelize");
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    //model은 static init과 static associate 메서드로 나뉘는데 init메서드에서는 테이블에대한 설정을하고
    //associate메서드에서는 다른 모델과의 관계를 적는다.
    return super.init(
      // init 메서드의 super.init 메서드 첫 번째 인수는 테이블 컬럼에 대한 설정이고, 두 번째 인수는 테이블 자체에 대한 설정이다.
      //시퀄라이즈는 알아서 id를 기본 키로 연결하므로, id 컬럼은 따로 적어줄 필요는 없다.
      {
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100), //암호화를 해야하는데 암호화하면 길이가 길어짐 그래서 100으로 넉넉하게 잡고
          allowNull: false, //
        },
        nickname: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        greeting: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        grade: {
          type: Sequelize.STRING(20),
          allowNull: false, //
          defaultValue: "Normal",
        },
        profileImg: {
          //프로필 파일 저장할때 이름을 어떻게 저장할지에 대한 고민 (중복의 여지가있으니 새로운 id값을 매번 생성해서 저장하는 방식으로 AI?)
          type: Sequelize.STRING(100),
          allowNull: true, //
        },
      },
      {
        //super.init의 두 번째 인수는 테이블 옵션이다.
        modelName: "User", //모델이름 - 노드프로젝트에서 사용
        tableName: "users", //실제 데이터베이스 컬럼 이름, 기본적으로 소문자, 복수형으로
        charset: "utf8", //한글도 쓸수있게  utf8mb4-이모티콘도 입력가능
        collate: "utf8_general_ci", //한글 저장  utf8mb4_general_ci-이모티콘도 입력가능
        sequelize, //static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. 나중에 model/index.js에서 연결한다.
        // timestamps는 기본으로 true로 설정되어있고 createdAt과updatedAt 컬럼을 생성시킴 - 필요없다면 false로
        // paranoid는 기본적으로 false, true가되면 로우를 삭제할때 완전히 지우지않고 deletedAt에 지운시각이 표시된다. 나중에 로우를 복원할일이 필요하다면 이 옵션을  true로 설정해주자
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.ProdPost); //foreignKey를 따로 지정하지 않는다면 이름이 모델명+기본 키인 컬럼이 모델에 생성된다
    db.User.hasMany(db.PowerPost);
    db.User.hasMany(db.TogetherPost);
    db.User.hasMany(db.TogetherPostComment); //users 테이블의 로우 하나를 불러올 때 연결된 comments 테이블의 로우들도 같이 불러올 수 있다.
    db.User.hasMany(db.PowerPostComment);
    db.User.hasMany(db.ProdPostComment);

    //image는 유저하나당 프로필사진 1개뿐이므로 따로 테이블로 빼지않고 컬럼화

    //db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); //유저가 좋아요를 누른 게시물들
    //유저가 여러개의 게시물에 좋아요를 누를수있고 한 게시글에 여려명이 좋아요를 누를수있으니까 m:n의 관계이다
    //m:n관계일때는 양쪽의 프라이머리키가 안쪽에 새로운 테이블로 들어가서 포린키가된다. //Like라는 through테이블이 생성된다.
    //db.sequelize.models.Like 이런식으로 자동으로 만들어진 모델에 접근할수있다.
    //user끼리 서로 좋아요를 누르는 기능도있으니까 셀프조인도 생각해야할듯. 나중에추가?

    // db.User.belongsToMany(db.User, {
    //   through: "Follow",
    //   as: "Followers", //부르는 입장에서 불리는 테이블의 알리아스 - 나중에 시퀄라이즈 쿼리문에 사용
    //   foreignKey: "FollowingId", //들어가는 컬럼명
    // }); //m:n관계일때는 반드시 through를 지정해줘야함 - 이 이름으로 through테이블이 데이터베이스에 생성됨

    // db.User.belongsToMany(db.User, {
    //   through: "Follow",
    //   as: "Followings",
    //   foreignKey: "FollowerId",
    // });
  }
};
