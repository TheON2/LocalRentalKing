const Sequelize = require("sequelize");
module.exports = class PowerPost extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        isRead: {
          //flag variable
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        modelName: "Message",
        tableName: "messages",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", //한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Message.belongsTo(db.ProdPost);
    db.Message.belongsTo(db.PowerPost);
    db.Message.belongsTo(db.TogetherPost);
  }
};
