const Sequelize = require("sequelize");
const prodPostComment = require("./prodPostComment");
const powerPostComment = require("./powerPostComment");
const togetherPostComment = require("./togetherPostComment");
// const prodPost = require("./prodPost");
// const powerPost = require("./powerPost");
// const togetherPost = require("./togetherPost");
const user = require("./user");
const prodPost = require("./prodPost");
const powerPost = require("./powerPost");
const togetherPost = require("./togetherPost");
const prodPostImage = require("./prodPostImage");
const powerPostImage = require("./powerPostImage");
const togetherPostImage = require("./togetherPostImage");
//const community4 = require("./powerPostImage");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.ProdPostComment = prodPostComment;
db.PowerPostComment = powerPostComment;
db.TogetherPostComment = togetherPostComment;

db.ProdPostImage = prodPostImage;
db.PowerPostImage = powerPostImage;
db.TogetherPostImage = togetherPostImage;

// db.ProdPost = prodPost;
// db.PowerPost = powerPost;
//db.TogetherPostImage = togetherPostImage;

db.User = user;

db.ProdPost = prodPost;
db.PowerPost = powerPost;
db.TogetherPost = togetherPost;

//db.Community4 = community4;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
