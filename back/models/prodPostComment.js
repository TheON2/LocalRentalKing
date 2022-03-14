const Sequelize = require("sequelize");
module.exports = class ProdPostComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "ProdPostComment",
        tableName: "prodPostComments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.ProdPostComment.belongsTo(db.ProdPost, {
      onDelete: "CASCADE",
    });
    db.ProdPostComment.belongsTo(db.User); //ProdPostComment는 유저에 포함되어있다.
  }
};
