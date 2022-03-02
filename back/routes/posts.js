const express = require("express");

const { Post, User, Image } = require("../models");

const router = express.Router();

router.get("/", (req, res, next) => {
  //게시판 처음 들어가면 10개 보여줌 작성자 컨텐츠 이미지 보여줌
  try {
    const posts = await Post.findAll({
      limit: 10, //10개만 가져와라
      order: [["createdAt", "DESC"]],
      include: [
        {
          //완성을 해서 가져와야기 때문에 사용자(작성자) 정보도 가져옴
          model: User, //포스트가 유저 아이디 가지고 있기 때문에 가능?
        },
        {
          model: Image,
        },
        // {
        //   model: Comment,
        // },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
