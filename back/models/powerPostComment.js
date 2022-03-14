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
    db.PowerPostComment.belongsTo(db.PowerPost, {
      onDelete: "CASCADE", //파워 포스트 작제되면 외래키(foreignkey)에 해당하는 튜플 삭제
    });
    db.PowerPostComment.belongsTo(db.User); //comments 테이블의 로우를 불러올 때 연결된 users 테이블의 로우를 가져온다.???????????????
    //powerPostComment테이블은 User테이블에 포함되어있다.
  }
};
