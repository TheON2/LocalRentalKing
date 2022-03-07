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
//====================게시글 10개 보여주기======================
router.get("/get10", async (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
  try {
    const where = {};
    //const cummunitynum = req.params.whatCummunity;
    //겟방식 /?솰라솰라하는게 쿼리스트링으로 들어온 라스트 아이디를 10진수로 바꿈
    if (parseInt(req.query.lastId, 10)) {
      //초기 로딩이 아닐때
      // (where.id = {
      //   [Op.lt]: parseInt(req.query.lastId, 10),
      // }),
      //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
      // where.whatCummunity = {
      //   [Op.eq]: req.params.whatCummunity,
      // };
      if (req.tagData != null) {
        (where.user_location = {
          [Op.eq]: req.body.location,
        }),
          (where.boardNum = {
            [Op.eq]: req.body.boardNum,
          }),
          (where.id = {
            [Op.lt]: parseInt(req.query.lastId, 10),
          }),
          (where.category = {
            [Op.eq]: req.body.tagData,
          }),
          console.log(where);
      } else {
        (where.user_location = {
          [Op.eq]: req.body.location,
        }),
          (where.boardNum = {
            [Op.eq]: req.body.boardNum,
          }),
          (where.id = {
            [Op.lt]: parseInt(req.query.lastId, 10),
          }),
          console.log(where);
      }
    }
    if (boardNum == 1 || boardNum == 2) {
      const prodposts = await ProdPost.findAll({
        where,
        // where: {
        //   whatCummunity: req.params.whatCummunity,
        // },
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
        // where: {
        //   whatCummunity: req.params.whatCummunity,
        // },
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
    //console.log(json(posts));
    //res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// //-------------게시글 10개 보여주기-------------------------------------
// router.get("/:whatCummunity", async (req, res, next) => {
//   //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
//   try {
//     const where = {};
//     //const cummunitynum = req.params.whatCummunity;
//     //겟방식 /?솰라솰라하는게 쿼리스트링으로 들어온 라스트 아이디를 10진수로 바꿈
//     if (parseInt(req.query.lastId, 10)) {
//       //초기 로딩이 아닐때
//       (where.id = {
//         [Op.lt]: parseInt(req.query.lastId, 10),
//       }), //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
//         // where.whatCummunity = {
//         //   [Op.eq]: req.params.whatCummunity,
//         // };
//         (where.userLocation = {
//           [Op.eq]: req.user.location,
//         }),
//         console.log(where);
//     }
//     if (req.params.whatCummunity == "community1") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community1,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     } else if (req.params.whatCummunity == "community2") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community2,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     } else if (t == "community3") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community3,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     } else if (req.params.whatCummunity == "community4") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community4,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     }

//     //console.log(json(posts));
//     //res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// //------------------게시판 들어가서 태그 누르면 그거에 맞는 게시글 10개 보여주기------------------
// router.get("/:whatCummunity/:tagData", async (req, res, next) => {
//   //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
//   try {
//     const where = {};

//     //겟방식 /?솰라솰라하는게 쿼리스트링으로 들어온 라스트 아이디를 10진수로 바꿈
//     if (parseInt(req.query.lastId, 10)) {
//       //초기 로딩이 아닐때
//       where.id = {
//         [Op.lt]: parseInt(req.query.lastId, 10),
//       }; //포스트id가 프론트에서 넘어온 lastId보다 작은 애들
//       // where.whatCummunity = {
//       //   [Op.eq]: req.params.whatCummunity,
//       // };
//       where.category = {
//         [Op.eq]: req.params.tagData,
//       };
//       where.userLocation = {
//         [Op.eq]: req.user.location,
//       };
//       console.log(where);
//     }

//     if (req.params.whatCummunity == "community1") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community1,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     } else if (req.params.whatCummunity == "community2") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community2,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     } else if (t == "community3") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community3,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     } else if (req.params.whatCummunity == "community4") {
//       const posts = await Post.findAll({
//         where,
//         // where: {
//         //   whatCummunity: req.params.whatCummunity,
//         // },
//         limit: 10, //10개만 가져와라
//         order: [["createdAt", "DESC"]],
//         include: [
//           {
//             //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//             model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//             attribute: ["id", "nickname"],
//           },
//           {
//             model: Image,
//           },
//           {
//             model: Community4,
//           },
//         ],
//       });
//       res.status(200).json(posts);
//     }

//     // const posts = await Post.findAll({
//     //   // where: { Category: req.params.tagData },
//     //   // where: {
//     //   //   Category: req.params.tagData,
//     //   //   whatCummunity: req.params.whatCummunity,
//     //   // },
//     //   where,
//     //   limit: 10, //10개만 가져와라
//     //   order: [["createdAt", "DESC"]], //최근거 10개
//     //   include: [
//     //     {
//     //       //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
//     //       model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
//     //       attribute: ["id", "nickname"],
//     //     },
//     //     {
//     //       model: Image,
//     //     },
//     //   ],
//     // });
//     // //console.log(json(posts));
//     // res.status(200).json(posts);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

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
      where.userLocation = {
        [Op.eq]: req.user.location,
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
