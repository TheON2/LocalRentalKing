const express = require("express");
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
  Message,
} = require("../models");
const { isLoggedIn } = require("./middlewares");
const router = express.Router();

// <------------ 쪽지 보내기(회원 아이디로 dm) ------------>
router.post("/", async (req, res, next) => {
  //   const title = req.body.title;
  //   const content = req.body.content;
  //   const isRead = false;
  //   const send_userId = req.body.send_userId;
  //   const receive_userId = req.body.receive_userId;

  try {
    const message = await Message.create({
      title: req.body.title,
      content: req.body.content,
      isRead: false,
      send_userId: req.body.send_userId,
      receive_userId: req.body.receive_userId,
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//=============== 내가 받은 쪽지들 프론트로 넘겨주기===============
router.get("/message", async (req, res, next) => {
  try {
    const message = await Message.findAll({
      receive_userId: req.body.userid,
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// <------------ 쪽지 보내기(게시물 통해서 쪽지) ------------>
router.post("/postMessage", async (req, res, next) => {
  try {
    const message = await Message.create({
      title: req.body.title,
      content: req.body.content,
      isRead: false, // default - 읽지않음
      send_userId: req.body.send_userId,
      receive_userId: req.body.receive_userId,
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
