const Sequelize = require("sequelize");
module.exports = class PowerPostComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "PowerPostComment",
        tableName: "powerPostComments",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PowerPostComment.belongsTo(db.PowerPost);
    db.PowerPostComment.belongsTo(db.User); //comments 테이블의 로우를 불러올 때 연결된 users 테이블의 로우를 가져온다.
  }
};
