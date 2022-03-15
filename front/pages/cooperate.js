import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import wrapper from "../store/configureStore";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { useInView } from "react-intersection-observer";

import AppLayout from "../components/AppLayout/AppLayout";

import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import {
  LOAD_PLAY_POST_REQUEST,
  LOAD_POST_REQUEST,
  UPDATE_BOARD,
  UPDATE_TAG,
} from "../reducers/post";
import Tags from "../components/Tags";
import PostCard1 from "../components/PostCard1";
import Layout from "../components/Layout";
import { Button } from "antd";
import PostCard2 from "../components/PostCard2";
import styled from "styled-components";
import a1 from "../components/광고1.jpeg";
import a2 from "../components/광고2.jpg";
import a3 from "../components/광고3.jpg";
import a4 from "../components/광고4.jpeg";
import a5 from "../components/광고5.jpg";
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

function Cooperate() {
  const dispatch = useDispatch();
  const [ref, inView] = useInView();
  const { me, location } = useSelector((state) => state.user);
  const {
    cooperate_tagsData,
    selectedTag,
    mainPosts,
    hasMorePost,
    loadPostLoading,
    id,
  } = useSelector((state) => state.post);
  const [view, setView] = useState(true);

  const onSwitch = useCallback(() => {
    setView(!view);
  }, [view]);

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

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: UPDATE_TAG,
      data: "전체",
    });
    dispatch({
      type: UPDATE_BOARD,
      data: 5,
    });
    dispatch({
      type: LOAD_POST_REQUEST,
      data: "전체",
      boardNum: 5,
      location: location,
    });
  }, [location]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id; // 인피니트 스크롤 구현을 위해 프론트 서버의 현재 렌더링중인 게시글들중 가장 아래 게시물의 게시넘버를 lastId로
          console.log(selectedTag);
          dispatch({
            type: LOAD_POST_REQUEST,
            data: selectedTag,
            boardNum: 5,
            lastId: lastId,
            location: location,
          });
        } // 지역변수를 건드려봣자 어차피 렌더링이 되지 않는다. 실제 동작으로 테스트 해야할듯
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostLoading, location]);

  if (!me) {
    return "내 정보 로딩중...";
  }

  return (
    <>
      <Head>
        <title>같이 하자 | 우리동네 렌탈대장</title>
      </Head>
      {view ? (
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
          <Tags tagsData={cooperate_tagsData} boardNum={5} />
          <Button onClick={onSwitch}>전환스위치</Button>
          {mainPosts.map((post) => (
            <PostCard1 key={post.id} post={post} />
          ))}
        </Layout>
      ) : (
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
          <Tags tagsData={cooperate_tagsData} boardNum={5} />
          <Button onClick={onSwitch}>전환스위치</Button>
          <PostCarDiv2>
            {mainPosts.map((post) => (
              <PostCard2 key={post.id} post={post} />
            ))}
          </PostCarDiv2>
        </Layout>
      )}
    </>
  );
}

export default Cooperate;
