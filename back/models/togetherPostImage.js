const Sequelize = require("sequelize");
module.exports = class TogetherPostImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: Sequelize.STRING(200),
          allowNull: true,
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
    db.TogetherPostImage.belongsTo(db.TogetherPost, {
      onDelete: "CASCADE",
    });
  }
};
