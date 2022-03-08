const Sequelize = require("sequelize");
module.exports = class TogetherPostImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        //이미지가 post의 이미지도 있고 user 프로필이미지도있는데 어떻게 구현하지? 각각의 postId나 userId로 찾아들어가면 되는건가?>
        //user프로필이미지는 어차피 1:1이니까 관계맺지말고 컬럼화하는식으로 방향을 잡아보자
        src: {
          //이미지 서버에 저장할때 이미지이름으로 저장하면 중복되는 문제가 발생할여지가있으니까 이미지파일의 아이디값을 따서 저장하는 방식으로
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: "TogetherPostImage",
        tableName: "togetherPostImages",
        charset: "utf8mb4", //한글도 쓸수있게
        collate: "utf8mb4_general_ci", //한글 저장
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.TogetherPostImage.belongsTo(db.TogetherPost);
  }
};
