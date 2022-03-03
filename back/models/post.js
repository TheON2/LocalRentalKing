const Sequelize = require("sequelize");
module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          //내용
          type: Sequelize.STRING(500),
          allowNull: false, //필수
        },
        title: {
          //제목
          type: Sequelize.STRING(50),
          allowNull: false, //필수
        },
        price: {
          //렌탈비용
          type: Sequelize.STRING(100),
          allowNull: true, //
        },
        whatCummunity: {
          //물건빌려줘 물건빌려줄게 같이하자 동네놀이터.. 선택
          type: Sequelize.STRING(50),
          allowNull: false, //필수임
        },
        Category: {
          //질문게시판?자유게시판?그 카테고리 필수아님 이거 쓰는곳은 동네 놀이터 뿐임
          type: Sequelize.STRING(50),
          allowNull: true, //필수아님
        },
        hashtag: {
          //질문게시판?자유게시판?그 카테고리 필수아님 이거 쓰는곳은 동네 놀이터 뿐임
          type: Sequelize.STRING(50),
          allowNull: true, //필수아님
        },
      },
      {
        modelName: "Post",
        tableName: "posts",
        charset: "utf8mb4", //한글도 쓸수있게
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Post.hasMany(db.Image); //게시물은 많은 이미지를 가질 수 있다.
    db.Post.hasMany(db.Comment); //게시글은 많은 댓글을 가질 수 있다.
    db.Post.belongsTo(db.User); //게시글은 유저에게 포함된다.->유저가 게시글을 많들었다.
    db.Post.belongsToMany(db.User, { through: "Like", as: "Kikers" }); //포스트는 여러 사람으로부터 좋아요를 받을 수 있다.
  }
};
