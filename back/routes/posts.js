const express = require("express");
const { Op } = require("sequelize");
const { isLoggedIn } = require("./middlewares");
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
router.get("/:tag/post", async (req, res, next) => {
  //Get /'공구'/post
  //게시판 처음 들어가면 10개 보여줌 작성자/ 컨텐츠 /이미지도 보여줌
  const boardNum = req.query.boardNum;
  const lastId = req.query.lastId; //프론트에서 받아온 라스트 아이디
  const tag = decodeURIComponent(req.params.tag); //한글로 들어온 tag를 디코딩
  const location = decodeURIComponent(req.query.location);
  console.log(lastId);

  try {
    const where = {}; // db에서 프론트가 전송한 아이디를 기반으로 유저id를 찾아낸다
    if (tag == "전체") {
      //들어온 태그가 전체라면
      if (parseInt(lastId, 10)) {
        //초기 로딩이 아닐때
        where.id = { [Op.lt]: parseInt(lastId, 10) }; //라스트 아이디보다 작은
        where.user_location = { [Op.eq]: location };
        where.boardNum = { [Op.eq]: boardNum }; //받아온 boardNum과 같은
      } else {
        //초기에 넘어오는 lastId는 0이기 때문에 이곳이 먼저 실행된다.
        where.user_location = { [Op.eq]: location };
        where.boardNum = { [Op.eq]: boardNum };
      }
    } else {
      //들어온 태그가 전체가 아니라면 / 공구, 의류 ...
      if (parseInt(lastId, 10)) {
        //초기 로딩이 아닐때
        where.id = { [Op.lt]: parseInt(lastId, 10) };
        where.user_location = { [Op.eq]: location };
        where.boardNum = { [Op.eq]: boardNum };
        where.category = { [Op.eq]: tag };
      } else {
        where.user_location = { [Op.eq]: location };
        where.boardNum = { [Op.eq]: boardNum };
        where.category = { [Op.eq]: tag };
      }
    }
    {
      if (boardNum == 1 || boardNum == 2) {
        //들어온 보드넘이 1혹은 2라면
        const prodposts = await ProdPost.findAll({
          //ProdPost테이블에서 찾을거임
          where, //위에서 만들어놓은 where을 쓰겠다
          limit: 10, //10개만 가져와라
          order: [["createdAt", "DESC"]], //생성 시간에 따라서 내림차순

          include: [
            {
              model: ProdPostImage, //이미지 소스도 포함해서 넘겨줄것이다
            },
            {
              model: ProdPostComment, //커멘트도 같이 넘겨줄것이다.
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
//createdAt을 기준으로 내림차순으로 10개를 보낸다.
//프론트에는 받은 포스트의 ID를 이용해서 lastId를 만들어서
//이후에 인피니트 스크롤이 작동할 때마다 요청을 백엔드로 보내게 된다.
//lastId 가 존재할 경우에 lastId보다 작은 10개를 보내게 된다

router.get("/:tag/tag", async (req, res, next) => {
  const boardNum = req.query.boardNum;
  const tag = decodeURIComponent(req.params.tag);
  const location = decodeURIComponent(req.query.location);
  try {
    const where = {}; // db에서 프론트가 전송한 아이디를 기반으로 유저id를 찾아낸다
    if (tag == "전체") {
      where.user_location = { [Op.eq]: location };
      where.boardNum = { [Op.eq]: boardNum };
    } else {
      where.user_location = { [Op.eq]: location };
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
  const location = decodeURIComponent(req.query.location);

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

// ================  [글제목/글내용] 게시물 조회  ====================
router.get("/search", isLoggedIn, async (req, res, next) => {
  const select = decodeURIComponent(req.query.select); //글제목 글내용 어떤것이 선택 되었는지 알려주기 위한 변수
  const searchword = decodeURIComponent(req.query.searchword);
  const location = decodeURIComponent(req.query.location);
  //const local = req.query.local; //원활한 테스트를 위해 임시적으로 지역조건검색은 막아놨습니다.
  const boardNum = req.query.boardNum;
  //const lastId = req.params.lastId; //원활한 테스트를 위해 임시적으로 인피니트 스크롤방식은 막아놨습니다.

  try {
    const where = {};

    if (select == "글제목") {
      where.title = { [Op.substring]: searchword }; // Like '%searchword%'
      //where.local = { [Op.eq]: local };
      where.user_location = { [Op.eq]: location };
    } else if (select == "글내용") {
      where.content = { [Op.substring]: searchword }; // Like '%searchword%'
      //where.local = { [Op.eq]: local };
      where.user_location = { [Op.eq]: location };
    }
    {
      if (boardNum == 1 || boardNum == 2) {
        const prodposts = await ProdPost.findAll({
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
        //힘을빌려줘 or 힘을 빌려줄게
        const powerposts = await PowerPost.findAll({
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
        //같이하자
        const togetherposts = await TogetherPost.findAll({
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
