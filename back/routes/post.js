const express = require("express");
const multer = require("multer"); //멀터는 폼마다 형식들이 다르기 때문에 멀터미들웨어를 사용해서 라우터마다 다르게 세팅필요
const path = require("path"); //노드에서 제공하는 모듈 http처럼, 설치가 필요없는 모듈
const fs = require("fs"); //file system을 조작할수있는 모듈. 폴더같은 걸 만들어줄수도있음
//const passport = require("passport");
//const bcrypt = require("bcrypt"); //해쉬화 알고리즘
const {
  Post,
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
const { isLoggedIn } = require("./middlewares");
//const { route } = require("./user");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

// <--------- 게시물 이미지업로드를 위한 multer생성  -------->
// <--------- 게시물 작성에서도 쓰기위해서 위치는 위로 올려줌 ------->
const upload = multer({
  storage: multer.diskStorage({
    //어디에 저장할지~ 당장은 컴퓨터 하드디스크에 여기만 나중에 s3로 갈아끼워주면 멀터가 알아서 하드디스크가 아니라 스토리지로 올려줌(배포시)
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      //사진.png
      const ext = path.extname(file.originalname); //확장자추출(.png, .jpg 등)
      const basename = path.basename(file.originalname, ext); // 사진
      done(null, basename + "_" + new Date().getTime() + ext); //사진_1513515313.png (같은 이름으로 이미지를 업로드하면 노드에서는 덮어씌워버려서 시간까지추가해서 올리는 코드)
    },
  }),
  limits: { fileSize: 28 * 1024 * 1024 }, //20mb로 파일 업로드 크기 제한
});

// <------------------------   글쓰기   ---------------------------->
router.post("/write", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST / post
  const boardNum = req.body.boardNum;
  if (boardNum == 1 || boardNum == 2) {
    //1:물건빌려줘, 2:물건 빌려줄게
    console.log("1번에 걸렸음");
    console.log(req.body.category);
    console.log(req.body.title);
    console.log(req.body.content);

    try {
      const prodPost = await ProdPost.create({
        boardNum: req.body.boardNum,
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
      //부족한 정보들(이미지, 댓글,글쓴이 )을 합쳐서 프론트에 보내줌
      const fullPost = await ProdPost.findOne({ where: { id: prodPost.id } });
      console.log(fullPost);
      res.status(201).json(fullPost); //프론트로 돌려줌
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else if (boardNum == 3 || boardNum == 4) {
    //3:힘을빌려줘, 4:힘을 빌려줄게
    console.log("2번에 걸렸음");
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
    console.log("3번에 걸렸음");
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

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// <------------------------  together 같이하자 글쓰기 테스트  ---------------------------->
router.post("/togetherPostTest", upload.none(), async (req, res, next) => {
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
});
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//     <------ 물건빌려줘/빌려줄게 이미지 업로드 ------>
router.post(
  "/prodImages",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    // POST /post/images
    //array인 이유는 이미지를 여러장 올릴수도있으니까.  하나의 인풋태그에서 여러개올릴때는 array고 2개이상의 인풋에서 이미지 올릴때는 fields로 대체
    //한장만 올리려면 array대신 single("image")
    //텍스트만 올리려면 none(),
    console.log(req.files); //업로드된 이미지 정보
    res.json(req.files.map((v) => v.filename)); //어디로 업로드되었는지에 대한 정보를 프론트에 전달
  }
);

//     <------ 힘을 빌려줘/빌려줄게 이미지 업로드 ------>
router.post(
  "/powerImages",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    // POST /post/images
    //array인 이유는 이미지를 여러장 올릴수도있으니까.  하나의 인풋태그에서 여러개올릴때는 array고 2개이상의 인풋에서 이미지 올릴때는 fields로 대체
    //한장만 올리려면 array대신 single("image")
    //텍스트만 올리려면 none(),
    console.log(req.files); //업로드된 이미지 정보
    res.json(req.files.map((v) => v.filename));
  }
);

//     <------ 같이하자 이미지 업로드 ------>
router.post(
  "/togetherImages",
  isLoggedIn,
  upload.array("image"),
  async (req, res, next) => {
    // POST /post/images
    //array인 이유는 이미지를 여러장 올릴수도있으니까.  하나의 인풋태그에서 여러개올릴때는 array고 2개이상의 인풋에서 이미지 올릴때는 fields로 대체
    //한장만 올리려면 array대신 single("image")
    //텍스트만 올리려면 none(),
    console.log(req.files); //업로드된 이미지 정보
    res.json(req.files.map((v) => v.filename));
  }
);

//     <-- 이미지 업로드 테스트 -->
router.post("/prodImages", upload.array("image"), async (req, res, next) => {
  console.log(req.files); //업로드된 이미지 정보
  res.json(req.files.map((v) => v.filename));
});

// <----댓글 작성 라우터---->
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  // POST / post / ? /comment
  //주소는 프론트와 백사이의 약속
  //주소에서 :postId는 요청만 보더라도 몇번 게시물에 댓글을 다는거구나~하고 한눈에 알수있게하려고
  //그런데 몇번 게시물에 요청할건지는 가변적. :postId로 파라미터로 받아서처리
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시물입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console(error);
    next(error);
  }
});

// <----댓글 작성 라우터 테스트---->
router.post("/:postId/comment", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시물입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.params.postId,
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console(error);
    next(error);
  }
});

// <----- 게시글 좋아요 ----->
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다");
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// <----- 게시글 좋아요 취소 ----->
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다");
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// //        <----- 게시글 수정 ----->
// route.patch("/edit", isLoggedIn, async (req, res, next) => {
//   try {
//     await User.update(
//       {
//         nickname: req.body.nickname, //프론트와 상의해서 넘겨받을 데이터 설정하기
//       },
//       {
//         where: { id: req.user.id, UserId: req.user.id, },
//       }
//     );
//     res.status(200).json({ nickname: req.body.nickname });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

//       <----- 게시글 삭제 ----->
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  // DELETE /post / ?
  try {
    await Post.destroy({
      where: {
        id: req.params.postId, //게시글 id
        UserId: req.user.id, //그 게시글을 쓴 유저의 id  ~혹여나 다른사람이 삭제할때 url만바꿔서 요청보내면 다른사람글도 삭제가능하니까
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) }); //params는 문자열로가서 int로 파싱
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/nickname", isLoggedIn, (req, res) => {});

module.exports = router;
