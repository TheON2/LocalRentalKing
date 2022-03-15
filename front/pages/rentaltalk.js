import React, { useCallback, useEffect, useState } from "react";
import wrapper from "../store/configureStore";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { useInView } from "react-intersection-observer";

import AppLayout from "../components/AppLayout/AppLayout";

import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import { LOAD_POST_REQUEST, UPDATE_BOARD, UPDATE_TAG } from "../reducers/post";
import Tags from "../components/Tags";
import PostCard1 from "../components/PostCard1";
import axios from "axios";
import Router from "next/router";
import Layout from "../components/Layout";
import { Button, Col, Form, Input, Row } from "antd";
import PostCard2 from "../components/PostCard2";
import styled from "styled-components";
import LoginForm from "../components/LoginForm";
import useInput from "../hooks/useInput";
import TalkCard1 from "../components/TalkCard1";
import TalkCard2 from "../components/TalkCard2";
const { TextArea } = Input;

const PostCarDiv2 = styled.div`
  width: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  // justify-content:center;
`;

const Div1 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  // justify-content:center;
`;
const Div2 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  // justify-content:center;
`;

let dummy = [
  { id: 1, send_userId: 2, receive_userID: 3, content: "안녕1", isRead: false },
  { id: 2, send_userId: 5, receive_userID: 2, content: "안녕2", isRead: false },
  { id: 3, send_userId: 2, receive_userID: 2, content: "안녕3", isRead: false },
  { id: 4, send_userId: 4, receive_userID: 3, content: "안녕4", isRead: false },
  { id: 5, send_userId: 2, receive_userID: 4, content: "안녕5", isRead: false },
  { id: 6, send_userId: 3, receive_userID: 5, content: "안녕6", isRead: false },
  { id: 7, send_userId: 5, receive_userID: 2, content: "안녕7", isRead: false },
  { id: 8, send_userId: 5, receive_userID: 2, content: "안녕8", isRead: false },
  { id: 9, send_userId: 6, receive_userID: 6, content: "안녕9", isRead: false },
  {
    id: 10,
    send_userId: 1,
    receive_userID: 3,
    content: "안녕10",
    isRead: false,
  },
  {
    id: 11,
    send_userId: 1,
    receive_userID: 3,
    content: "안녕11",
    isRead: false,
  },
];

function Rentaltalk() {
  const dispatch = useDispatch();
  const { me, location } = useSelector((state) => state.user);
  const {
    mainTalks,
    talkUsers,
    selectedTag,
    object_TagsData,
    mainPosts,
    hasMorePost,
    loadPostLoading,
    id,
  } = useSelector((state) => state.post);
  const [view, setView] = useState(true);
  const [content, onContent, setContent] = useInput("");
  const [selectedPost, onSelectedPost, setSelectedPost] = useInput([]);

  const onSwitch = useCallback(() => {
    setView(!view);
  }, [view]);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: UPDATE_BOARD,
      data: 8,
    });
    // dispatch({
    //   type: LOAD_TALK_REQUEST,
    // });
  }, [location]);

  useEffect(() => {
    if (me) {
      const Talks = dummy
        .filter((talk) => talk.receive_userId !== me.id)
        .concat(dummy.filter((talk) => talk.send_userId !== me.id));
      //내가 보냈거나 나에게 온 메시지들을 따로 모아준다.
      console.log(Talks);
      // const allUsers = Talks.receive_userId.concat(Talks.send_userId);
      //
      // const set = new Set(allUsers);
      //
      // const users = [...set];
      //
      // console.log(users);
    }
  }, [me]);

  if (!me) {
    return "내 정보 로딩중...";
  }

  return (
    <>
      <Head>
        <title> 렌탈톡 | 우리동네 렌탈대장</title>
      </Head>
      <Layout>
        <Row gutter={8}>
          <Col xs={12} md={12}>
            <Div1>
              {mainTalks.map(
                (talk) =>
                  talk.receive_userId === me.id && (
                    <UserCard key={talk.id} userInfo={talk} />
                  )
              )}
            </Div1>

            {/*  톡 리스트 컴포넌트 */}
            {/* 나의정보에서 대화내역 // 대화중인 유저정보  */}
            {/*  대화중인 상대의 아이디카드와 새 메시지 숫자 마지막메시지 온 시간 */}
          </Col>
          <Col xs={0} md={0}></Col>
          <Col xs={12} md={12}>
            {view && (
              <Div2>
                <PostCard1 post={selectedPost} />
                {mainTalks.map((talk) =>
                  view ? (
                    <TalkCard1 key={talk.id} talk={talk} />
                  ) : (
                    <TalkCard2 key={talk.id} talk={talk} />
                  )
                )}
                <TextArea
                  placeholder="내용을 입력해주세요"
                  autoSize={{ minRows: 1, maxRows: 7 }}
                  value={content}
                  onChange={onContent}
                />
              </Div2>
            )}
            {/*  톡 포스트폼 컴포넌트*/}
            {/*  게시물정보 // 게시자정보 // 나의정보에서 대화내역 */}
            {/*  게시물 포스트카드 // 대화내역 // 입력창 */}
          </Col>
        </Row>
      </Layout>
    </>
  );
}

export default Rentaltalk;
