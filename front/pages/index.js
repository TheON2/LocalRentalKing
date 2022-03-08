import React, {useCallback, useEffect, useState} from 'react';
import wrapper from '../store/configureStore';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { END } from 'redux-saga';
import {Button, Col, Row} from 'antd';

import AppLayout from '../components/AppLayout/AppLayout';
import LoginForm from '../components/LoginForm';

import {LOAD_MY_INFO_REQUEST, logoutRequestAction} from '../reducers/user';
import {LOAD_POST_REQUEST, TEST, UPDATE_TAG} from '../reducers/post';
import Tags from "../components/Tags";
import PostCard1 from "../components/DH/PostCard1";
import axios from "axios";

function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading, reTweetError, id , object_TagsData , selectedTag } = useSelector((state) => state.post);
  const [ref, inView] = useInView();

  const string = "abc*def*123";
  const split = string.split("*");

  console.log(split);

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id; // 인피니트 스크롤 구현을 위해 프론트 서버의 현재 렌더링중인 게시글들중 가장 아래 게시물의 게시넘버를 lastId로
          console.log(selectedTag);
          dispatch({
            type: LOAD_POST_REQUEST,
            data:selectedTag,
            boardNum:1,
            lastId:lastId,
          });
        } // 지역변수를 건드려봣자 어차피 렌더링이 되지 않는다. 실제 동작으로 테스트 해야할듯
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [ hasMorePost, loadPostLoading]);

  return (
    <div>{me ? (
      <AppLayout>
        {/*<Button onClick={}> 로그아웃</Button>*/}
        <Tags tagsData={object_TagsData} boardNum={1}/>
        {/*{post1.map((post) => <PostCard1 key={post.Id} post={post}/>)}*/}
        {mainPosts.map((post) => <PostCard1 key={post.id} post={post} />)}
        {/*<div ref={hasMorePost && !loadPostLoading ? ref : undefined} />*/}
      {/* 아직 게시물을 전부 열람하지 않았고 && 게시물을 요청하는 중이 아닐경우 인피니트 스크롤 동작 : 아닐경우 undefined */}
      </AppLayout>
    ) : (
      <Row gutter={8}>
        <Col xs={24} md={10}>
          <img src="main.png" style={{ height: 950 }}/>
        </Col>
        <Col xs={24} md={10}>
          <h1>우리동네 렌탈대장을 지금 이용해 보세요!</h1>
          <LoginForm style={{ marginTop: 300 }} />
        </Col>
        <Col xs={24} md={4}>
        </Col>
      </Row>
    )}
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = cookie;
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) { // 타 유저간 쿠키가 공유되는 문제를 방지하기 위함
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: UPDATE_TAG,
    data:"전체",
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data:"전체",
    boardNum:1,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
