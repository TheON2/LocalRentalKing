const express = require("express");
const { Op } = require("sequelize");
const { Post, User, Image, Comment } = require("../models");
const TogetherPost = require("../models/togetherPost");
const PowerPost = require("../models/powerPost");
const ProdPost = require("../models/prodPost");
const ProdPostImage = require("../models/prodPostImage");
const ProdPostComment = require("../models/prodPostComment");
const PowerPostImage = require("../models/powerPostImage");
const PowerPostComment = require("../models/powerPostComment");
const TogetherPostImage = require("../models/togetherPostImage");
const TogetherPostComment = require("../models/togetherPostComment");

const router = express.Router();

// <--------- 게시물 10개씩 렌더링---------->
//router.get("/", async (req, res, next) => {
router.get("/:tag/post", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
  const boardNum = req.query.boardNum;
  const lastId = req.query.lastId;
  console.log(lastId);

  try {
    const where = {}; // db에서 프론트가 전송한 아이디를 기반으로 유저id를 찾아낸다
    if (req.params.tag == "전체") {
      if (parseInt(lastId, 10)) {
        //초기 로딩이 아닐때
        where.id = { [Op.lt]: parseInt(lastId, 10) };
        //where.user_location = { [Op.eq]: req.body.location };
        where.boardNum = { [Op.eq]: boardNum };
      } else {
        // where.user_location = { [Op.eq]: req.body.location };
        where.boardNum = { [Op.eq]: boardNum };
      }
    } else {
      if (parseInt(lastId, 10)) {
        //초기 로딩이 아닐때
        where.id = { [Op.lt]: parseInt(lastId, 10) };
        //where.user_location = { [Op.eq]: req.body.location };
        where.boardNum = { [Op.eq]: boardNum };
        where.category = { [Op.eq]: req.params.tag };
      } else {
        // where.user_location = { [Op.eq]: req.body.location };
        where.boardNum = { [Op.eq]: boardNum };
        where.category = { [Op.eq]: req.params.tag };
      }
    }

    {
      if (boardNum == 1 || boardNum == 2) {
        //들어온 보드넘이 1혹은 2라면
        const prodposts = await ProdPost.findAll({
          //ProdPost테이블에서 찾을거임

          where,
          limit: 10, //10개만 가져와라
          order: [["createdAt", "DESC"]], //생성 시간에 따라서 내림차순

          include: [
            {
              model: ProdPostImage,
            },
            {
              model: ProdPostComment,
            },
          ],
        });
        console.log(prodposts);
        res.status(200).json(prodposts);
      } else if (boardNum == 3 || boardNum == 4) {
        //보드넘이3 혹은 4라면->힘을빌려줘,힘을 빌려줄게
        const powerposts = await PowerPost.findAll({
          //PowerPost테이블에서 찾을거임
          where,
          limit: 10, //10개만 가져와라
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: PowerPostImage,
            },
            {
              model: PowerPostComment,
            },
          ],
        });
        res.status(200).json(powerposts);
      } else if (boardNum == 5) {
        //보드넘이5라면->같이하자
        const togetherposts = await TogetherPost.findAll({
          //같이하자 테이블에서 찾을거임
          where,
          limit: 10, //10개만 가져와라
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TogetherPostImage,
            },
            {
              model: TogetherPostComment,
            },
          ],
        });
        res.status(200).json(togetherposts);
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
