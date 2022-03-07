const Sequelize = require("sequelize");
module.exports = class PowerPost extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        boardNum: {
          //물건빌려줘 물건빌려줄게 같이하자 동네놀이터.. 선택
          type: Sequelize.STRING(50),
          allowNull: false, //필수임
        },
        category: {
          //질문게시판?자유게시판?그 카테고리 필수아님 이거 쓰는곳은 동네 놀이터 뿐임
          type: Sequelize.STRING(50),
          allowNull: true, //필수아님
        },

        title: {
          //제목
          type: Sequelize.STRING(50),
          allowNull: false, //필수
        },
        content: {
          //내용
          type: Sequelize.STRING(500),
          allowNull: false, //필수
        },
        price: {
          //렌탈비용
          type: Sequelize.INTEGER,
          allowNull: true, //
        },
        user_nickname: {
          type: Sequelize.STRING(50),
          allowNull: false, //필수
        },

        user_location: {
          type: Sequelize.STRING(100),
          allowNull: false, //필수
        },

        // hashtag: {
        //   //질문게시판?자유게시판?그 카테고리 필수아님 이거 쓰는곳은 동네 놀이터 뿐임
        //   type: Sequelize.STRING(50),
        //   allowNull: true, //필수아님
        // },
      },
      {
        modelName: "PowerPost",
        tableName: "powerposts",
        charset: "utf8mb4", //한글도 쓸수있게
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PowerPost.hasMany(db.PowerPostImage); //게시물은 많은 이미지를 가질 수 있다.
    db.ProdPost.hasMany(db.PowerPostComment); //게시글은 많은 댓글을 가질 수 있다.
    db.ProdPost.belongsTo(db.User); //게시글은 유저에게 포함된다.->유저가 게시글을 많들었다.
    //db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //포스트는 여러 사람으로부터 좋아요를 받을 수 있다.
    //db.Post.hasMany(db.Community1); //물건빌려줘,빌려줄게,힘빌려줘힘빌려줄게
    //db.Post.hasMany(db.Community2); //같이하자1+1
    //db.Post.hasMany(db.Community3); //같이하자 배달
    // db.Post.hasMany(db.Community4); //같이하자 공동구매
  }
};
