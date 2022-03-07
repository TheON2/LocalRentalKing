const Sequelize = require("sequelize");
module.exports = class TogetherPostComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(100),
          allowNull: false, //필수
        },

        user_nickname: {
          type: Sequelize.STRING(50),
          allowNull: false, //필수
        },
      },

      {
        modelName: "TogetherPostComment",
        tableName: "togethercomments",
        charset: "utf8mb4", //한글도 쓸수있게
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.TogetherPostComment.belongsTo(db.TogetherPost);
    //db.Comment.belongsTo(db.User);
  }
};
