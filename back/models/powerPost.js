const Sequelize = require("sequelize");
module.exports = class PowerPost extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        boardNum: {
          //화면왼쪽 물건빌려줘, 힘을빌려줘 등의 탭 구분 ~ 숫자로
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        category: {
          //화면 오른쪽 공구,의류,전자기기 등의 카테고리 구분 // 글자로
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        user_location: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "PowerPost",
        tableName: "powerPosts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PowerPost.belongsTo(db.User); //이건 post의 작성자 //post.addUser(여기서는 s가 안붙어) hasMany나 belongsToMany는 s가 논리적으로 붙지
    db.PowerPost.belongsToMany(db.User, { through: "Favorite", as: "Likers" }); //게시글 좋아요 누른 사람들
    //나중에 as 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.
    //post.addLikers, post.removeLikers등의 관계형 메서드가 생긴다.
    // add,get,set,remove -- 관계형 메서드
    db.PowerPost.hasMany(db.PowerPostImage, {
      onDelete: "CASCADE", //power포스트의 tuple이 삭제되면 powerpost의 id(key)를 foreignkey로 가지고 있는 다른 테이블의 튜플도
      //같이 삭제된다
    });
    db.PowerPost.hasMany(db.PowerPostComment, {
      onDelete: "CASCADE", //연관 삭제
    });
    db.PowerPost.hasMany(db.Message);
  }
};
