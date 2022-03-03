const Sequelize = require("sequelize");
module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        price: {
          type: Sequelize.STRING(100),
          allowNull: true, //
        },
        tab: {
          //화면왼쪽 물건빌려줘, 힘을빌려줘 등의 탭 구분
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        Category: {
          //화면 오른쪽 공구,의류,전자기기 등의 카테고리 구분
          type: Sequelize.STRING(50),
          allowNull: true,
        },
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.hasMany(db.Image);
    db.Post.hasMany(db.Comment);
    db.Post.belongsTo(db.User); //이건 post의 작성자
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //게시글 좋아요 누른 사람들
    //나중에 as 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.
  }
};
