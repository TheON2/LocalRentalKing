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

router.get("/", async (req, res, next) => {
  //카테고리별 조회 //요청을 프론트에서 어떻게 받을지 상의필요, req.param으로 받을지, req.query로 받을지
  try {
    const where = {};
    const comNum = req.query.communityNum;
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // Op.lt ~보다작은 *operator
    }
    // where.communityNum = {
    //   //where절안에 있으면 lastId가 없을때 tab으로 구분해서 못보여줌
    //   [Op.eq]: req.query.communityNum, //eq  equal
    //};
    if (comNum == "community1") {
      const posts = await Post.findAll({
        //   limit: 10, // 10개만 가져와라
        //   offset: 0, // 시작인덱스. 0이면 1~10(limit)번 게시물까지 가져옴
        //   order : [['createdAt','DESC']] //최신게시물부터 가져옴. 2차원 배열인 이유는 여러 기준으로 정렬할수있기때문에
        // limit과 offset은 실무에서는 잘 안쓰는 방법, 중간에 게시글이 추가되거나 삭제되면 꼬여버리기때문에
        // 실무에서는 pagination구현을 위해 limit과 lastId방식을 많이쓴다

        where, // sql에서 지원하는 offset대신에 우리가 lastId 정보를 만들어서 조회하도록
        limit: 3, //테스트때는 우선은 2개씩만 렌더링하자 편의상
        order: [
          ["createdAt", "DESC"],
          [Comment, "createdAt", "DESC"], // 여기에서 댓글 내림차순정리
        ],
        include: [
          //데이터를 가져올때는 항상 완성해서 가져와야한다.
          {
            model: User, //작성자
            attributes: ["id", "nickname"],
          },
          {
            model: Image, //이미지
          },
          {
            model: Comment, //댓글
            include: [
              {
                model: User, //댓글 작성자
                attributes: ["id"], //댓글 수만 표시하면 되니까
                //댓글들 정렬할때도 여기다가 order정렬을 하는게아니라
              },
            ],
          },
          {
            model: Community1,
          },
          // //게시글이 몇개의 좋아요를 받고있는지 표시해주는부분. 구현미정, 구현방법미정
          // {
          //   model: User,
          //   attributes: ["id"],
          // },
        ],
      });
    } else if (comNum == "community2") {
      const posts = await Post.findAll({
        where,
        limit: 3,
        order: [
          ["createdAt", "DESC"],
          [Comment, "createdAt", "DESC"],
        ],
        include: [
          {
            model: User, //작성자
            attributes: ["id", "nickname"],
          },
          {
            model: Image, //이미지
          },
          {
            model: Comment, //댓글
            include: [
              {
                model: User, //댓글 작성자
                attributes: ["id"], //댓글 수만 표시하면 되니까
              },
            ],
          },
          {
            model: Community2,
          },
        ],
      });
    } else if (comNum == "community3") {
      const posts = await Post.findAll({
        where,
        limit: 3,
        order: [
          ["createdAt", "DESC"],
          [Comment, "createdAt", "DESC"],
        ],
        include: [
          {
            model: User, //작성자
            attributes: ["id", "nickname"],
          },
          {
            model: Image, //이미지
          },
          {
            model: Comment, //댓글
            include: [
              {
                model: User, //댓글 작성자
                attributes: ["id"], //댓글 수만 표시하면 되니까
              },
            ],
          },
          {
            model: Community3,
          },
        ],
      });
    } else if (comNum == "community4") {
      const posts = await Post.findAll({
        where,
        limit: 3,
        order: [
          ["createdAt", "DESC"],
          [Comment, "createdAt", "DESC"],
        ],
        include: [
          {
            model: User, //작성자
            attributes: ["id", "nickname"],
          },
          {
            model: Image, //이미지
          },
          {
            model: Comment, //댓글
            include: [
              {
                model: User, //댓글 작성자
                attributes: ["id"], //댓글 수만 표시하면 되니까
              },
            ],
          },
          {
            model: Community4,
          },
        ],
      });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
