const express = require("express");
const router = express.Router();
const { Post } = require("../models");
const { isLoggedIn } = require("./middlewares"); //로그인된 사람인지 확인

router.post("/", isLoggedIn, async (req, res, next) => {
  //포스트 생성
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

router.post("/:postId/postDetail", async (req, res, next) => {
  //포스트 눌렀을때 가져오기
  //POST/post/postDetail
  try {
    const postOne = await Post.findOne({
      where: {
        id: req.params.postId,
      },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 대상 게시물 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, //좋아요 누른사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(postOne);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  //게시글의 댓글 다는..
  //POST/post/1/comment
  //POST/post
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId, //동적으로 변하는 포스트 아이디를 받아서..
      UserId: req.user.id,
    });
    res.status(201).json(comment); //생성되면 그걸 제이슨으로 res에 보내줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  //PATCH /post/1/like
  //patch는 부분수정/좋아요 누르면 ...
  try {
    const post = await Post.findOne({
      //좋아요 누른 포스트가 있는지 찾음
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("좋아요를 누른 게시글이 좋재하지 않습니다");
    }
    await post.addUsers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  //DELETE /post/1/like
  //patch는 부분수정/좋아요 누르면 ...
  try {
    const post = await Post.findOne({
      //좋아요 누른 포스트가 있는지 찾음
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("좋아요를 누른 게시글이 좋재하지 않습니다");
    }
    await post.removeLikers(req.user.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  //DELETE /post/10

  try {
    await Post.destroy({
      where: { id: req.params.postId, UserId: req.user.id },
    });
    res.json({ PostId: parseInt(req.params.postId) }); //파람스로 하면 문자열임 그래서 인트로바꿔줌
  } catch (error) {
    console.error(error);
    next(error);
  }
  res.json({ id: 1 });
});

module.exports = router;
