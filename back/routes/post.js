const express = require("express");
const multer = require("multer"); //멀터는 폼마다 형식들이 다르기 때문에 멀터미들웨어를 사용해서 라우터마다 다르게 세팅필요
const path = require("path"); //노드에서 제공하는 모듈 http처럼, 설치가 필요없는 모듈,기본 경로를 가져온다
const fs = require("fs"); //file system을 조작할수있는 모듈.
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
} = require("../models"); //models에서 가져와서 쓰겠다.
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

//들어가기 전에 uploads폴더가 없으면 만들겠다. 있다면 안만든다.
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
      done(null, basename + "_" + new Date().getTime() + ext); //사진_1513515313.png (같은 이름으로 이미지를 업로드하면 노드에서는 기존파일에 덮어씌워버려서 시간까지추가해서 올리는 코드)
    },
  }),
  limits: { fileSize: 28 * 1024 * 1024 }, //20mb로 파일 업로드 크기 제한
});

// <------------------------   글쓰기   ---------------------------->
router.post("/write", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST / post/write
  const boardNum = req.body.boardNum;
  if (boardNum == 1 || boardNum == 2) {
    //1:물건빌려줘, 2:물건 빌려줄게
    console.log("1번에 걸렸음");
    console.log(req.body.category);
    console.log(req.body.title);
    console.log(req.body.content);

    try {
      //ProdPost 테이블에 create 하겠다
      const prodPost = await ProdPost.create({
        boardNum: boardNum,
        category: req.body.category, // 공구, 의류, 전자기기, 서적 등등 //
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        UserId: req.body.userid,
        user_nickname: req.body.nickname,
        user_location: req.body.location,
        status: 0,
      });
      if (req.body.image) {
        //만약 글 작성시 이미지를 넣었다면
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
      const fullPost = await ProdPost.findOne({ where: { id: prodPost.id } });
      res.status(201).json(fullPost); //프론트로 돌려줌
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
        status: 0,
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
        status: 0,
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

//====================글 하나 찾아오기===========================
router.get("/singlepost", async (req, res, next) => {
  // GET / post/singlepost
  console.log("싱글포스트 진입");
  try {
    const boardNum = req.query.postBoardNum; //쿼리 스트링으로 받아온 postBoardNum을 쓰겠다
    const postId = req.query.postId; //쿼리 스트링으로 받아온 postId를 쓰겠다
    if (boardNum == 1 || boardNum == 2) {
      //쿼리 스트링으로 받아온 보드 넘버가 1 혹은 2라면(물건 빌려줘/물건 빌려줄게 일때)
      const prodpost = await ProdPost.findOne({
        where: {
          id: postId,
        },
        include: [
          {
            model: User, //포스트 작성자
            attributes: ["id", "nickname"], //포스트 작성자의 아이디와 닉네임을 가져다 쓰겠다
            //
          },
          {
            model: ProdPostImage, //이미지를 가져다 쓰겠다
          },
          {
            model: ProdPostComment, //댓글을 가져다 쓰겠다.
            include: [
              {
                model: User, //댓글 작성자 위의 유저와 다른 사람임
                attributes: ["id", "nickname"],
              },
            ],
          },
        ],
      });
      console.log(prodpost); //findOne의 결과를 콘솔 로그로 찍어보겠다
      res.status(200).json(prodpost); //findOne의 결과를 성공 status를 보내고 json형식으로 프론트에 넘기겠다
    } else if (boardNum == 3 || boardNum == 4) {
      const powerpost = await PowerPost.findOne({
        where: {
          id: postId,
        },
        include: [
          {
            model: User, //작성자
            attributes: ["id", "nickname"],
          },
          {
            model: PowerPostImage, //이미지
          },
          {
            model: PowerPostComment, //댓글
            include: [
              {
                model: User, //댓글 작성자
                attributes: ["id", "nickname"],
              },
            ],
          },
        ],
      });
      console.log(powerpost);
      res.status(200).json(powerpost);
    } else if (boardNum == 5) {
      const togetherpost = await TogetherPost.findOne({
        where: {
          id: postId,
        },
        include: [
          //데이터를 가져올때는 항상 완성해서 가져와야한다.
          {
            model: User, //작성자
            attributes: ["id", "nickname"],
          },
          {
            model: TogetherPostImage, //이미지
          },
          {
            model: TogetherPostComment, //댓글
            include: [
              {
                model: User, //댓글 작성자
                attributes: ["id", "nickname"],
              },
            ],
          },
        ],
      });
      console.log(togetherpost);
      res.status(200).json(togetherpost);
    }
  } catch {
    console.error(error);
    next(error);
  }
});

//  <------ 이미지 업로드 ------>  //
router.post(
  "/images",
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

// <----댓글 작성 라우터---->
router.post("/writeComment", isLoggedIn, async (req, res, next) => {
  const boardNum = req.body.boardNum;
  if (boardNum == 1 || boardNum == 2) {
    try {
      const post = await ProdPost.findOne({
        //포스트가 존재하는지 찾아본다/없는 게시물에 댓글을 다는 이상한 행위를 차단
        where: { id: req.body.postId },
      });
      if (!post) {
        //댓글을 요청한 게시물이 없다면 ..
        return res.status(403).send("존재하지 않는 게시물입니다.");
      }
      const comment = await ProdPostComment.create({
        //포스트가 존재한다면 코멘트 테이블에 결과를 create
        content: req.body.content,
        PostId: req.body.postId,
        UserId: req.body.id,
      });
      const fullComment = await ProdPostComment.findOne({
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
  } else if (boardNum == 3 || boardNum == 4) {
    try {
      const post = await PowerPost.findOne({
        where: { id: req.body.postId },
      });
      if (!post) {
        return res.status(403).send("존재하지 않는 게시물입니다.");
      }
      const comment = await PowerPostComment.create({
        content: req.body.content,
        PostId: req.body.postId,
        UserId: req.body.id,
      });
      const fullComment = await PowerPostComment.findOne({
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
  } else if (boardNum == 5) {
    try {
      const post = await TogetherPost.findOne({
        where: { id: req.body.postId },
      });
      if (!post) {
        return res.status(403).send("존재하지 않는 게시물입니다.");
      }
      const comment = await TogetherPostComment.create({
        content: req.body.content,
        PostId: req.body.postId,
        UserId: req.body.id,
      });
      const fullComment = await TogetherPostComment.findOne({
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
  }
});

// // <----- 게시글 좋아요 ----->
// router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
//   // PATCH /post/1/like
//   try {
//     const post = await Post.findOne({ where: { id: req.params.postId } });
//     if (!post) {
//       return res.status(403).send("게시글이 존재하지 않습니다");
//     }
//     await post.addLikers(req.user.id);
//     res.json({ PostId: post.id, UserId: req.user.id });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// // <----- 게시글 좋아요 취소 ----->
// router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
//   // DELETE /post/1/like
//   try {
//     const post = await Post.findOne({ where: { id: req.params.postId } });
//     if (!post) {
//       return res.status(403).send("게시글이 존재하지 않습니다");
//     }
//     await post.removeLikers(req.user.id);
//     res.json({ PostId: post.id, UserId: req.user.id });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

//        <----- 게시글 수정 ----->
router.patch("/edit", upload.none(), async (req, res, next) => {
  const boardNum = req.body.boardNum;
  const userid = req.body.userid;
  const postid = req.body.id;
  const rcategory = req.body.category;
  const rtitle = req.body.title;
  const rcontent = req.body.content;
  const rprice = req.body.price;
  const rlocation = req.body.location;
  const roriginalPrice = req.body.originalPrice;
  const rsharedPrice = req.body.sharedPrice;
  try {
    if (boardNum == 1 || boardNum == 2) {
      await ProdPost.update(
        {
          category: rcategory,
          title: rtitle,
          content: rcontent,
          price: rprice,
          user_location: rlocation,
        },
        {
          where: { id: postid, UserId: userid }, //글쓴이와 게시글의 id가 모두 일치할때만 수정 가능
        }
      );

      const post = await ProdPost.findOne({ where: { id: postid } });
      if (req.body.image) {
        await ProdPostImage.destroy({
          where: { id: postid },
        });
        if (Array.isArray(req.body.image)) {
          //이미지가 여러개

          const images = await Promise.all(
            req.body.image.map((image) => ProdPostImage.create({ src: image }))
          );
          await post.addProdPostImages(images);
        } else {
          //이미지가 하나
          const image = await ProdPostImage.create({ src: req.body.image });
          await post.addProdPostImages(image);
        }
      }
      res.status(200).json("게시글 수정 완료");
    } else if (boardNum == 3 || boardNum == 4) {
      await PowerPost.update(
        {
          category: rcategory,
          title: rtitle,
          content: rcontent,
          price: rprice,
          user_location: rlocation,
        },
        {
          where: { id: postid, UserId: userid },
        }
      );
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
      res.status(200).json("게시글 수정 완료");
    } else if (boardNum == 5) {
      await TogetherPost.update(
        {
          category: rcategory,
          title: rtitle,
          content: rcontent,
          user_location: rlocation,
          originalPrice: roriginalPrice,
          sharedPrice: rsharedPrice,
        },
        {
          where: { id: postid, UserId: userid },
        }
      );
      if (req.body.image) {
        if (Array.isArray(req.body.image)) {
          //이미지 여러개
          const images = await Promise.all(
            req.body.image.map((image) =>
              TogetherPostImage.create({ src: image })
            )
          );
          await TogetherPost.addTogetherPosTImages(images);
        } else {
          //이미지 하나
          const image = await TogetherPostImage.create({ src: req.body.image });
          await TogetherPost.addPTogetherPostImages(image);
        }
      }
      res.status(200).json("게시글 수정 완료");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//       <----- 게시글 삭제 ----->
router.delete("/delete", isLoggedIn, async (req, res, next) => {
  // DELETE /post /delete
  const boardNum = req.query.boardNum;
  console.log(boardNum);
  if (boardNum == 1 || boardNum == 2) {
    try {
      await ProdPost.destroy({
        //
        where: {
          id: req.query.postId, //받아온 postId와 ProdPost의 id가 같은 튜플을 삭제시킨다.
          UserId: req.query.id, //이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???이거바꿔야함???
        },
      });
      res.status(200).send("삭제 성공");
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else if (boardNum == 3 || boardNum == 4) {
    try {
      await PowerPost.destroy({
        where: {
          id: req.query.postId,
          UserId: req.query.id, //이거바꿔야함???이거바꿔야함???이거바꿔야함??? //이거바꿔야함???이거바꿔야함???이거바꿔야함??? //이거바꿔야함???이거바꿔야함???이거바꿔야함???
        },
      });
      res.status(200).send("삭제 성공");
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else if (boardNum == 5) {
    try {
      await TogetherPost.destroy({
        where: {
          id: req.query.postId,
          UserId: req.query.id, //이거바꿔야함???이거바꿔야함???이거바꿔야함??? //이거바꿔야함???이거바꿔야함???이거바꿔야함??? //이거바꿔야함???이거바꿔야함???이거바꿔야함???
        },
      });
      res.status(200).send("삭제 성공");
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

//       <----- 게시글 거래상태 변경 ----->
router.patch("/status", isLoggedIn, async (req, res, next) => {
  const boardNum = req.body.boardNum;
  const userid = req.body.userid;
  const postid = req.body.id;
  const rstatus = req.body.status;
  console.log(boardNum);
  try {
    if (boardNum == 1 || boardNum == 2) {
      await ProdPost.update(
        {
          status: rstatus,
        },
        {
          where: { id: postid, UserId: userid }, //글쓴이와 게시글의 id가 모두 일치할때만 수정 가능
        }
      );
      res.status(200).json("거래상태 변경 완료");
    } else if (boardNum == 3 || boardNum == 4) {
      await PowerPost.update(
        {
          status: rstatus,
        },
        {
          where: { id: postid, UserId: userid },
        }
      );
      res.status(200).json("거래상태 변경 완료");
    } else if (boardNum == 5) {
      await TogetherPost.update(
        {
          status: rstatus,
        },
        {
          where: { id: postid, UserId: userid },
        }
      );
      res.status(200).json("거래상태 변경 완료");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
