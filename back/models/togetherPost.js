const Sequelize = require("sequelize");
module.exports = class TogetherPost extends Sequelize.Model {
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
          allowNull: false,
        },
        originalPrice: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sharedPrice: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user_location: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "TogetherPost",
        tableName: "togetherPosts",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.TogetherPost.belongsTo(db.User); //투게더포스트는 유저에 포함되어 있다
    db.TogetherPost.belongsToMany(db.User, {
      through: "Favorite",
      as: "Likers",
    }); //게시글 좋아요 누른 사람들
    //나중에 as 따라서 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다.
    //post.addLikers, post.removeLikers등의 관계형 메서드가 생긴다.
    // add,get,set,remove -- 관계형 메서드
    db.TogetherPost.hasMany(db.TogetherPostImage, {
      onDelete: "CASCADE",
    });
    db.TogetherPost.hasMany(db.TogetherPostComment, {
      onDelete: "CASCADE",
    });
    db.TogetherPost.hasMany(db.Message);
  }
};
