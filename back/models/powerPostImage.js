const Sequelize = require("sequelize");
module.exports = class PowerPostImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          type: Sequelize.STRING(200),
          allowNull: true, //사실상 널값이 들어올 일은 없다.글 추가 부분에서 이미지가 있는지 없는지에 따라서
          //create 해줄 것이기 때문에 널값이 들어올 일은 없으나 만일을 대비해서 true로 해줬다.
        },
      },
      {
        modelName: "PowerPostImage",
        tableName: "powerPostImages",
        charset: "utf8mb4", //한글도 쓸수있게
        collate: "utf8mb4_general_ci", //한글 저장
        timestamps: false,
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PowerPostImage.belongsTo(db.PowerPost, {
      onDelete: "CASCADE", //연관된 파워포스트가 삭제되면 같이 삭제되겠다.
    });
  }
};
