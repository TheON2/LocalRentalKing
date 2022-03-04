const express = require("express");
const { Op } = require("sequelize"); //~보다 작다 새로운 문법형, 원래것 sql인젝션 위협있음
const { Post, User, Image } = require("../models");

const router = express.Router();

//-------------게시글 10개 보여주기-------------------------------------
router.get("/:whatCummunity", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
  try {
    const where = {};

    //겟방식 /?솰라솰라하는게 쿼리스트링으로 들어온 라스트 아이디를 10진수로 바꿈
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      }; //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
      where.whatCummunity = {
        [Op.eq]: req.params.whatCummunity,
      };
      console.log(where);
    }
    const posts = await Post.findAll({
      where,
      // where: {
      //   whatCummunity: req.params.whatCummunity,
      // },
      limit: 10, //10개만 가져와라
      order: [["createdAt", "DESC"]],
      include: [
        {
          //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
          model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
          attribute: ["id", "nickname"],
        },
        {
          model: Image,
        },
      ],
    });
    //console.log(json(posts));
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//------------------게시판 들어가서 태그 누르면 그거에 맞는 게시글 10개 보여주기------------------
router.get("/:whatCummunity/:tagData", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
  try {
    const where = {};

    //겟방식 /?솰라솰라하는게 쿼리스트링으로 들어온 라스트 아이디를 10진수로 바꿈
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      }; //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
      where.whatCummunity = {
        [Op.eq]: req.params.whatCummunity,
      };
      where.Category = {
        [Op.eq]: req.params.tagData,
      };
      console.log(where);
    }
    const posts = await Post.findAll({
      // where: { Category: req.params.tagData },
      // where: {
      //   Category: req.params.tagData,
      //   whatCummunity: req.params.whatCummunity,
      // },
      where,
      limit: 10, //10개만 가져와라
      order: [["createdAt", "DESC"]], //최근거 10개
      include: [
        {
          //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
          model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
          attribute: ["id", "nickname"],
        },
        {
          model: Image,
        },
      ],
    });
    //console.log(json(posts));
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//============게시판마다 검색해서 결과 10개 포스트 가져오기==============
router.get("/:whatCummunity/search/:search", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
  try {
    const where = {};

    //겟방식 /?솰라솰라하는게 쿼리스트링으로 들어온 라스트 아이디를 10진수로 바꿈
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      }; //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
      where.whatCummunity = {
        [Op.eq]: req.params.whatCummunity,
      };
      where.title = {
        [Op.substring]: req.params.search,
      };
      console.log(where);
    }
    const posts = await Post.findAll({
      // where: { Category: req.params.tagData },
      // where: {
      //   Category: req.params.tagData,
      //   whatCummunity: req.params.whatCummunity,
      // },
      where,
      limit: 10, //10개만 가져와라
      order: [["createdAt", "DESC"]], //최근거 10개
      include: [
        {
          //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
          model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
          attribute: ["id", "nickname"],
        },
        {
          model: Image,
        },
      ],
    });
    //console.log(json(posts));
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
