const express = require("express");
const { Op } = require("sequelize");
const {
  User,
  ProdPost,
  ProdPostImage,
  ProdPostComment,
  PowerPost,
  PowerPostImage,
  PowerPostComment,
  TogetherPost,
  TogetherPostImage,
  TogetherPostComment,
} = require("../models");

const router = express.Router();

// <--------- 게시물 10개씩 렌더링---------->
//router.get("/", async (req, res, next) => {

router.get("/:tag/post", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
  const boardNum = req.query.boardNum;
  const lastId = req.query.lastId;
  const tag = decodeURIComponent(req.params.tag);
  console.log(lastId);

  try {
    const where = {}; // db에서 프론트가 전송한 아이디를 기반으로 유저id를 찾아낸다
    if (tag == "전체") {
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
        where.category = { [Op.eq]: tag };
      } else {
        // where.user_location = { [Op.eq]: req.body.location };
        where.boardNum = { [Op.eq]: boardNum };
        where.category = { [Op.eq]: tag };
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
              include: [
                {
                  model: User, //댓글 작성자 정보까지 보내도록 수정했습니다.
                  attributes: ["id", "nickname"],
                },
              ],
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
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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

router.get("/:tag/tag", async (req, res, next) => {
  const boardNum = req.query.boardNum;
  const tag = decodeURIComponent(req.params.tag);
  try {
    const where = {}; // db에서 프론트가 전송한 아이디를 기반으로 유저id를 찾아낸다
    if (tag == "전체") {
      // where.user_location = { [Op.eq]: req.body.location };
      where.boardNum = { [Op.eq]: boardNum };
    } else {
      where.boardNum = { [Op.eq]: boardNum };
      where.category = { [Op.eq]: tag };
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
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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

// router.get('/:tag/post', async (req, res, next) => {
//   //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
//   const boardNum = req.query.boardNum;
//   const lastId = req.query.lastId;
//   console.log(lastId);
//   try {
//     // const where = {}; //초기에 조건없음
//     // 라스트
//     // 아이디가
//     // 0
//     // 이
//     // 아니라면
//     // if (req.params.tag !== null) {
//     //   console.log("여기들어옴");
//     //   //태그 데이터가 널이 아니라면->오른쪽 태그 눌렀음
//     //   // (where.user_location = {
//     //   //   //유저 위치
//     //   //   [Op.eq]: req.body.location,
//     //   // }),
//     //   //   (where.boardNum = {
//     //   //     //보드넘버
//     //   //     [Op.eq]: req.body.boardNum,
//     //   //   }),
//     //   (where.id = {
//     //     //라스트아이디
//     //     [Op.lt]: parseInt(req.query.lastId, 10),
//     //   }),
//     //     // (where.category = {
//     //     //   //왼쪽탭
//     //     //   [Op.eq]: req.body.tag,
//     //     // }),
//     //     console.log(where); //다합쳐진 where완성
//     // } else {
//     //   //태그 데이터가 널이라면->태그 안눌렀고 그냥10개 나옴
//     //   (where.user_location = {
//     //     [Op.eq]: req.body.location,
//     //   }),
//     //     (where.id = {
//     //       [Op.lt]: parseInt(req.query.lastId, 10),
//     //     }),
//     //     console.log(where);
//     // }
//     const where = {}; // db에서 프론트가 전송한 아이디를 기반으로 유저id를 찾아낸다
//     if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
//       where.id = {
//         [Op.lt]: parseInt(req.query.lastId, 10),
//       }
//     }
//
//     if (boardNum == 1 || boardNum == 2) {
//       //들어온 보드넘이 1혹은 2라면
//       const prodposts = await ProdPost.findAll({
//         //ProdPost테이블에서 찾을거임
//         where,
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]], //생성 시간에 따라서 내림차순
//         include: [
//           {
//             model: ProdPostImage,
//           },
//           {
//             model: ProdPostComment,
//           },
//         ],
//       });
//       console.log(prodposts);
//       res.status(200).json(prodposts);
//     } else if (boardNum == 3 || boardNum == 4) {
//       //보드넘이3 혹은 4라면->힘을빌려줘,힘을 빌려줄게
//       const powerposts = await PowerPost.findAll({
//         //PowerPost테이블에서 찾을거임
//         where,
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             model: PowerPostImage,
//           },
//           {
//             model: PowerPostComment,
//           },
//         ],
//       });
//       res.status(200).json(powerposts);
//     } else if (boardNum == 5) {
//       //보드넘이5라면->같이하자
//       const togetherposts = await TogetherPost.findAll({
//         //같이하자 테이블에서 찾을거임
//         where,
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             model: TogetherPostImage,
//           },
//           {
//             model: TogetherPostComment,
//           },
//         ],
//       });
//       res.status(200).json(togetherposts);
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// =========================== 회원 닉네임으로 게시물 조회==============================
router.get("/postnick", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
  const boardNum = req.query.boardNum;
  const nickname = req.query.nickname;

  try {
    const nick = await User.findOne({
      where: {
        nickname: nickname, // db에서 프론트가 전송한 닉네임을 기반으로 유저를 찾아낸다
      },
    });

    const where = {};

    where.boardNum = { [Op.eq]: boardNum };
    where.UserId = { [Op.eq]: nick.id };

    {
      if (boardNum == 1 || boardNum == 2) {
        //들어온 보드넘이 1혹은 2라면
        const prodposts = await ProdPost.findAll({
          //ProdPost테이블에서 찾을거임

          where,
          order: [["createdAt", "DESC"]], //생성 시간에 따라서 내림차순

          include: [
            {
              model: ProdPostImage,
            },
            {
              model: ProdPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: PowerPostImage,
            },
            {
              model: PowerPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
            },
          ],
        });
        res.status(200).json(powerposts);
      } else if (boardNum == 5) {
        //보드넘이5라면->같이하자
        const togetherposts = await TogetherPost.findAll({
          //같이하자 테이블에서 찾을거임
          where,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TogetherPostImage,
            },
            {
              model: TogetherPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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

// =========================== 글 제목으로 게시물 조회==============================
router.get("/posttitle", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
  const boardNum = req.query.boardNum;
  const title = req.query.title;

  try {
    const where = {};

    where.boardNum = { [Op.eq]: boardNum };
    where.title = { [Op.substring]: title }; // %like%

    {
      if (boardNum == 1 || boardNum == 2) {
        //들어온 보드넘이 1혹은 2라면
        const prodposts = await ProdPost.findAll({
          //ProdPost테이블에서 찾을거임

          where,
          order: [["createdAt", "DESC"]], //생성 시간에 따라서 내림차순

          include: [
            {
              model: ProdPostImage,
            },
            {
              model: ProdPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: PowerPostImage,
            },
            {
              model: PowerPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
            },
          ],
        });
        res.status(200).json(powerposts);
      } else if (boardNum == 5) {
        //보드넘이5라면->같이하자
        const togetherposts = await TogetherPost.findAll({
          //같이하자 테이블에서 찾을거임
          where,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TogetherPostImage,
            },
            {
              model: TogetherPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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

// =========================== content로 게시물 조회==============================
router.get("/postcontent", async (req, res, next) => {
  const boardNum = req.query.boardNum;
  const content = req.query.content;

  try {
    const where = {};

    where.boardNum = { [Op.eq]: boardNum };
    where.content = { [Op.substring]: content };

    {
      if (boardNum == 1 || boardNum == 2) {
        //들어온 보드넘이 1혹은 2라면
        const prodposts = await ProdPost.findAll({
          //ProdPost테이블에서 찾을거임

          where,
          order: [["createdAt", "DESC"]], //생성 시간에 따라서 내림차순

          include: [
            {
              model: ProdPostImage,
            },
            {
              model: ProdPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: PowerPostImage,
            },
            {
              model: PowerPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
            },
          ],
        });
        res.status(200).json(powerposts);
      } else if (boardNum == 5) {
        //보드넘이5라면->같이하자
        const togetherposts = await TogetherPost.findAll({
          //같이하자 테이블에서 찾을거임
          where,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: TogetherPostImage,
            },
            {
              model: TogetherPostComment,
              include: [
                {
                  model: User, //댓글 작성자
                  attributes: ["id", "nickname"],
                },
              ],
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
