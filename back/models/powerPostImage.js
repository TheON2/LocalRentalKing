const Sequelize = require("sequelize");
module.exports = class ProdPostImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: Sequelize.STRING(100),
          allowNull: false, //
        }, //이미지가 저장될 경로 ./어디어디/
      },
      {
        modelName: "PowerPostImage",
        tableName: "powerpostimages",
        charset: "utf8mb4", //한글도 쓸수있게
        collate: "utf8mb4_general_ci", //한글 저장
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PowerPostImage.belongsTo(db.PowerPost); //이미지는 게시물에 종속되고 postID를 외래키로 가져올거임
  }
};
