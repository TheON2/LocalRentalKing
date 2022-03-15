import React, { useCallback, useEffect, useState } from "react";
import wrapper from "../store/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { END } from "redux-saga";
import { Button, Col, Row } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import a3 from "../components/광고3.jpg";
import a1 from "../components/광고1.jpeg";
import a2 from "../components/광고2.jpg";
import a4 from "../components/광고4.jpeg";
import a5 from "../components/광고5.jpg";
import {
  LOAD_MY_INFO_REQUEST,
  logoutRequestAction,
  UPDATE_LOCAL,
} from "../reducers/user";
import {
  LOAD_POST_REQUEST,
  TEST,
  UPDATE_BOARD,
  UPDATE_TAG,
} from "../reducers/post";
import Tags from "../components/Tags";
import PostCard1 from "../components/PostCard1";
import axios from "axios";
import Layout from "../components/Layout";
import PostCard2 from "../components/PostCard2";
import SearchBar from "../components/SearchBar";
import styled from "styled-components";

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

function SSRPAGE() {
  const dispatch = useDispatch();
  const { me, location } = useSelector((state) => state.user);
  const {
    mainPosts,
    hasMorePost,
    loadPostLoading,
    reTweetError,
    id,
    object_TagsData,
    selectedTag,
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
  }, []);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (me) {
      dispatch({
        type: UPDATE_LOCAL,
        data: me.location,
      });
    }
  }, [me]);

  useEffect(() => {
    if (me) {
      dispatch({
        type: UPDATE_TAG,
        data: "전체",
      });
      dispatch({
        type: LOAD_POST_REQUEST,
        data: "전체",
        boardNum: 1,
        location: location,
      });
    }
  }, []);

  // useEffect(()=>{
  //   dispatch({
  //     type: LOAD_POST_REQUEST,
  //     data: "전체",
  //     boardNum: 1,
  //   });
  // },[]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id; // 인피니트 스크롤 구현을 위해 프론트 서버의 현재 렌더링중인 게시글들중 가장 아래 게시물의 게시넘버를 lastId로
          dispatch({
            type: LOAD_POST_REQUEST,
            data: selectedTag,
            boardNum: 1,
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
  }, [hasMorePost, loadPostLoading]);

  return (
    <div>
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
          <div style={{ textAlign: "center" }}>
            <Tags tagsData={object_TagsData} boardNum={1} />
            <Button onClick={onSwitch}>전환스위치</Button>
          </div>
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
          <div style={{ textAlign: "center" }}>
            <Tags tagsData={object_TagsData} boardNum={1} />
            <Button onClick={onSwitch}>전환스위치</Button>
          </div>
          <PostCarDiv2>
            {mainPosts.map((post) => (
              <PostCard2 key={post.id} post={post} />
            ))}
          </PostCarDiv2>
        </Layout>
      )}
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = cookie;
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      // 타 유저간 쿠키가 공유되는 문제를 방지하기 위함
      axios.defaults.headers.Cookie = cookie;
    }
    context.store.dispatch({
      type: UPDATE_TAG,
      data: "전체",
    });
    context.store.dispatch({
      type: UPDATE_BOARD,
      data: 1,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: "전체",
      boardNum: 1,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default SSRPAGE;
