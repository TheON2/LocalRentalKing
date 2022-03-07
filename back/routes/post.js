const express = require("express");
const multer = require("multer"); //라우터에 장착하는게 대부분임
const path = require("path"); //파일의 확장자를 꺼내올 수 있음
const fs = require("fs"); //파일 시스템을 조작하는
const {
  ProdPost,
  PowerPost,
  TogetherPost,
  Post,
  Image,
  Comment,
  User,
} = require("../models");

const { isLoggedIn } = require("./middlewares"); //로그인된 사람인지 확인

const router = express.Router();

//=======이미지 업로드 폴더 uploads를 만듬 이미 존재한다면 안만듬=======
try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads폴더가 없으므로 생성합니다");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "upload");
    },
    filename(req, file, done) {
      //백종훈.jpg
      const ext = path.extname(file.originalname); //확장자 추출(png)
      const basename = path.basename(file.originalname, ext);
      done(null, basename + "_" + new Date().getTime() + ext); //백종훈15185218958129.png
      //다른 사람의 이미지를 덮어 씌우는것을 방지하기 위한 코드
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20MB로 제한
});

//------------------게시글 생성 물건빌려줘빌려줄게....-----------------------------------------------
router.post("/write", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST / post
  const boardNum = req.body.boardNum;
  if (boardNum == 1 || boardNum == 2) {
    //1:물건빌려줘, 2:물건 빌려줄게
    try {
      const prodPost = await ProdPost.create({
        boardNum: boardNum,
        category: req.body.category, // 공구, 의류, 전자기기, 서적 등등 //
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        UserId: req.body.userid,
        user_nickname: req.body.nickname,
        user_location: req.body.location,
      });
      if (req.body.image) {
        if (Array.isArray(req.body.image)) {
          //이미지가 여러개올라오면 image:[사진1.png, 사진2.png]  ~배열
          const images = await Promise.all(
            req.body.image.map((image) => ProdPostImage.create({ src: image })) //프로미스배열
          );
          await prodPost.addProdPostImages(images);
        } else {
          //이미지가 하나만 올라오면 image : 사진.png
          const image = await ProdPostImage.create({ src: req.body.image });
          await prodPost.addProdPostImages(image);
        }
      }

      res.status(201).json(prodPost); //프론트로 돌려줌
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else if (boardNum == 3 || boardNum == 4) {
    //3:힘을빌려줘, 4:힘을 빌려줄게
    try {
      const powerPost = await PowerPost.create({
        boardNum: boardNum,
        category: req.body.category, //
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        UserId: req.body.userid,
        user_nickname: req.body.nickname,
        user_location: req.body.location,
      });
      if (req.body.image) {
        if (Array.isArray(req.body.image)) {
          //이미지 여러개
          const images = await Promise.all(
            req.body.image.map((image) => PowerPostImage.create({ src: image }))
          );
          await powerPost.addPowerPostImages(images);
        } else {
          //이미지 하나
          const image = await PowerPostImage.create({ src: req.body.image });
          await powerPost.addPowerPostImages(image);
        }
      }
      res.status(201).json(powerPost);
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else if (boardNum == 5) {
    //5:같이하자
    try {
      const togetherPost = await TogetherPost.create({
        boardNum: boardNum,
        category: req.body.category, //
        title: req.body.title,
        content: req.body.content,
        originalPrice: req.body.originalPrice,
        sharedPrice: req.body.sharedPrice,
        UserId: req.body.userid,
        user_nickname: req.body.nickname,
        user_location: req.body.location,
      });
      if (req.body.image) {
        if (Array.isArray(req.body.image)) {
          //이미지 여러개
          const images = await Promise.all(
            req.body.image.map((image) =>
              TogetherPostImage.create({ src: image })
            )
          );
          await togetherPost.addTogetherPosTImages(images);
        } else {
          //이미지 하나
          const image = await TogetherPostImage.create({ src: req.body.image });
          await togetherPost.addPTogetherPostImages(image);
        }
      }
      res.status(201).json(togetherPost);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

//==========================이미지 업로드===============================
router.post(
  "/images",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    console.log(req.files); //업로드가 어떻게 되었는지 정보
    res.json(req.files.map((v) => v.filename)); //어디로 업로드가 되었는지 파일명을 프론트로 넘겨줌
  }
);

//==========================게시글 디테일하게 가져오기===================================
router.post("/:postId/postDetail", async (req, res, next) => {
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

//----------------------게시글에 댓글 달기---------------------------------------
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  //POST/post/1/comment
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

//-----------------------게시글 좋아요 누르기------------------------------
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

//---------------게시글 좋아요 누른거 취소하기-----------------------------------
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

//----------------------게시글 삭제하기-------------------------------
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
