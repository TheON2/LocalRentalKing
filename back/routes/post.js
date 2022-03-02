const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { isLoggedIn } = require("./middlewares"); //로그인된 사람인지 확인

router.post("/", isLoggedIn, async (req, res, next) => {
  //미들웨어 확장?
  //POST/post
  try {
    const post = await Post.create({
      content: req.body.content,
      title: req.body.title,
      price: req.body.price,
      whatCummunity: req.body.whatCummunity,
      Category: req.body.Category,
      hashtag: req.body.hashtag,
      UserId: req.user.id,
    });
    res.status(201).json(post); //생성되면 그걸 제이슨으로 res에 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  //댓글 다는..
  //POST/post/1/comment
  //POST/post
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다");
    }
    const post = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId, //동적으로 변하는 포스트 아이디를 받아서..
      UserId: req.user.id,
    });
    res.status(201).json(post); //생성되면 그걸 제이슨으로 res에 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/", (req, res) => {
  //DELETE/post
  res.json({ id: 1 });
});
