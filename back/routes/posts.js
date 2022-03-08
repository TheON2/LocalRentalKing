const express = require("express");
const { Op } = require("sequelize"); //~보다 작다 새로운 문법형, 원래것 sql인젝션 위협있음
const {
  ProdPost,
  PowerPost,
  TogetherPost,
  User,
  ProdPostComment,
  PowerPostComment,
  TogetherPostComment,
  ProdPostImage,
  PowerPostImage,
  TogetherPostImage,
} = require("../models");

const router = express.Router();
//====================게시글 10개 보여주기==================================
// router.get("/get10", async (req, res, next) => {
router.get("/:tagData/post", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
  try {
    const where = {}; //초기에 조건없음
    if (parseInt(req.query.lastId, 10)) {
      //라스트 아이디가 0이 아니라면

      if (req.params.tagData != null) {
        //태그 데이터가 널이 아니라면->오른쪽 태그 눌렀음
        (where.user_location = {
          //유저 위치
          [Op.eq]: req.body.location,
        }),
          (where.boardNum = {
            //보드넘버
            [Op.eq]: req.query.boardNum,
          }),
          (where.id = {
            //라스트아이디
            [Op.lt]: parseInt(req.query.lastId, 10),
          }),
          (where.category = {
            //왼쪽탭
            [Op.eq]: req.params.tagData,
          }),
          console.log(where); //다합쳐진 where완성
      } else {
        //태그 데이터가 널이라면->태그 안눌렀고 그냥10개 나옴
        (where.user_location = {
          [Op.eq]: req.body.location,
        }),
          (where.boardNum = {
            //보드넘버
            [Op.eq]: req.query.boardNum,
          }),
          (where.id = {
            [Op.lt]: parseInt(req.query.lastId, 10),
          }),
          console.log(where);
      }
    }
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
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//============게시판마다 검색해서 결과 10개 포스트 가져오기==============
router.get("/searchGet10", async (req, res, next) => {
  //검색창의 검색 결과로 게시글을 조회함(제목으로 검색)
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10),
      }; //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
      where.title = {
        [Op.substring]: req.body.search, //입력받은 search가 타이틀에 포함되어 있다면
      };
      where.user_location = {
        [Op.eq]: req.body.location,
      };
      console.log(where);
    }

    if (boardNum == 1 || boardNum == 2) {
      const prodposts = await ProdPost.findAll({
        where,
        limit: 10, //10개만 가져와라
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: ProdPostImage,
          },
          {
            model: ProdPostComment,
          },
        ],
      });
      res.status(200).json(prodposts);
    } else if (boardNum == 3 || boardNum == 4) {
      const powerposts = await PowerPost.findAll({
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
      const togetherposts = await TogetherPost.findAll({
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
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
