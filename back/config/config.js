const dotenv = require("dotenv"); //.env에서 설정 파일을 가져와서 require하겠다

dotenv.config();

module.exports = {
  development: {
    username: "root", //디비 유저네임
    password: process.env.DB_PASSWORD, //1234 보안을위해서/.env는 숨겨놓는다
    database: "LocalRentalKing", //이름 바꾸자
    host: "127.0.0.1", // mysql host는 기본적으로 127.0.0.1
    port: "3306",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "LocalRentalKing",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "LocalRentalKing",
    host: "127.0.0.1",
    port: "3306",
    dialect: "mysql",
  },
};
