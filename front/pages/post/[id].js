import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router, { useRouter } from "next/router";
import AppLayout from "../../components/AppLayout/AppLayout";
import { LOAD_SPOST_REQUEST } from "../../reducers/post";
import { Avatar, Button, Card, Form } from "antd";
import PostImages from "../../components/PostImages";
import Link from "next/link";
import Layout from "../../components/Layout";
import Reply from "../../components/DH/Reply";
import moment from "moment";
import styled from "styled-components";
import a1 from "../../components/광고1.jpeg";
import a2 from "../../components/광고2.jpg";
import a3 from "../../components/광고3.jpg";
import a4 from "../../components/광고4.jpeg";
import a5 from "../../components/광고5.jpg";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const PostCarDiv2 = styled.div`
  width: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  justify-content: center;
`;
const AdvertisementDiv = styled.div`
  width: 100%;
  height: 297px;
  // background:blue;
  position: relative;
`;

function PostPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // [tag].js 파일 명의 [] 부분이 들어간다
  const { singlePost, mainPosts, hasMorePost, loadPostLoading, location } =
    useSelector((state) => state.post);
  const { userInfo, me } = useSelector((state) => state.user);

  const advImg = [
    {
      src: a1,
    },
    {
      src: a2,
    },
    {
      src: a3,
    },
    {
      src: a4,
    },
    {
      src: a5,
    },
  ];

  const [i, Seti] = useState(0);
  const [imgSrc, SetImgSrc] = useState(a1);
  const RchangeImg = () => {
    if (i < 5) {
      Seti(i + 1);
      SetImgSrc(advImg[i].src);
    } else if (i === 5) {
      Seti(0);
    }
  };
  const LchangImg = () => {
    if (i > 0) {
      Seti(i - 1);
      SetImgSrc(advImg[i - 1].src);
      console.log(imgSrc);
    }
  };

  const idAndBoardNum = id.split("*");
  const postId = idAndBoardNum[0];
  const postBoardNum = idAndBoardNum[1];
  const [postId2, setPostId] = useState(postId);
  const [postBoardNum2, setPostBoardNum] = useState(postBoardNum);

  const onPage = useCallback(() => {
    Router.push(`/modify/${postId}*${postBoardNum}`, undefined, {
      shallow: true,
    });
  }, []);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: LOAD_SPOST_REQUEST,
      postId: postId,
      postBoardNum: postBoardNum,
    });
  }, []);

  // useEffect(()=>{
  //   setTimeout(() => {
  //     if(singlePost === null)
  //     {
  //       setPostId((prev)=>prev-1);
  //       dispatch({
  //         type:LOAD_SPOST_REQUEST,
  //         postId:postId2,
  //         postBoardNum:postBoardNum,
  //       });
  //     }
  //   }, 500);
  // },[postId2,postBoardNum2]);

  const prevPage = useCallback(() => {
    setPostId((prev) => prev - 1);
    dispatch({
      type: LOAD_SPOST_REQUEST,
      postId: postId2,
      postBoardNum: postBoardNum2,
    });
  }, [postId2, postBoardNum2]);

  const nextPage = useCallback(() => {
    setPostId((prev) => prev + 1);
    dispatch({
      type: LOAD_SPOST_REQUEST,
      postId: postId2,
      postBoardNum: postBoardNum2,
    });
  }, [postId2, postBoardNum2]);

  return (
    <Layout>
      <AdvertisementDiv>
        <img src={imgSrc} width="100%" height="100%" />
        <div
          style={{ position: "absolute", top: "130px", width: "50px" }}
          onClick={LchangImg}
        >
          <LeftOutlined style={{ fontSize: "25px", color: "gray" }} />
        </div>
        <div
          style={{
            position: "absolute",
            top: "130px",
            left: "900px",
            width: "50px",
          }}
          onClick={RchangeImg}
        >
          <RightOutlined style={{ fontSize: "25px", color: "gray" }} />
        </div>
      </AdvertisementDiv>
      {singlePost && (
        <Form
          layout="horizontal"
          form={form}
          initialValues={{
            layout: "horizontal",
          }}
        >
          {singlePost.boardNum === 1 && (
            <div>
              {singlePost.ProdPostImages.length > 0 ? (
                <Card
                  cover={<PostImages images={singlePost.ProdPostImages} />}
                  title={singlePost.title}
                >
                  {singlePost.content}
                </Card>
              ) : (
                <Card title={singlePost.title}>{singlePost.content}</Card>
              )}
              <Reply />
            </div>
          )}
          {singlePost.boardNum === 2 && (
            <div>
              {singlePost.ProdPostImages.length > 0 ? (
                <Card
                  cover={<PostImages images={singlePost.ProdPostImages} />}
                  title={singlePost.title}
                >
                  {singlePost.content}
                </Card>
              ) : (
                <Card title={singlePost.title}>{singlePost.content}</Card>
              )}
              <Reply />
            </div>
          )}
          {singlePost.boardNum === 3 && (
            <div>
              {singlePost.PowerPostImages.length > 0 ? (
                <Card
                  cover={<PostImages images={singlePost.PowerPostImages} />}
                  title={singlePost.title}
                >
                  {singlePost.content}
                </Card>
              ) : (
                <Card title={singlePost.title}>{singlePost.content}</Card>
              )}
            </div>
          )}
          {singlePost.boardNum === 4 && (
            <div>
              {singlePost.PowerPostImages.length > 0 ? (
                <Card
                  cover={<PostImages images={singlePost.PowerPostImages} />}
                  title={singlePost.title}
                >
                  {singlePost.content}
                </Card>
              ) : (
                <Card title={singlePost.title}>{singlePost.content}</Card>
              )}
            </div>
          )}
          {singlePost.boardNum === 5 && (
            <div>
              {singlePost.TogetherPostImages.length > 0 ? (
                <Card
                  cover={<PostImages images={singlePost.TogetherPostImages} />}
                  title={singlePost.title}
                >
                  {singlePost.content}
                </Card>
              ) : (
                <Card title={singlePost.title}>{singlePost.content}</Card>
              )}
            </div>
          )}
          <div>
            <Button onClick={prevPage}>이전글</Button>
            <Button onClick={nextPage}>다음글</Button>
            <Button onClick={onPage}>수정</Button>
          </div>
        </Form>
      )}
    </Layout>
  );
}

export default PostPage;
