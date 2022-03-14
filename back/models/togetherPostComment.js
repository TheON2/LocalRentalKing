const Sequelize = require("sequelize");
module.exports = class TogetherPostComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "TogetherPostComment",
        tableName: "togetherPostComments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.TogetherPostComment.belongsTo(db.TogetherPost, {
      onDelete: "CASCADE",
    });
    db.TogetherPostComment.belongsTo(db.User);
  }
};
