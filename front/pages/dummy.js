import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import wrapper from '../store/configureStore';
import Head from 'next/head';
import {useDispatch, useSelector} from 'react-redux';
import { END } from 'redux-saga';
import { useInView } from "react-intersection-observer";

import AppLayout from '../components/AppLayout/AppLayout';

import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import {LOAD_O_RECIEVE_POST_REQUEST, LOAD_POST_REQUEST, UPDATE_TAG} from '../reducers/post';
import {Button} from "antd";
import Tags from "../components/Tags";
import PostCard1 from "../components/PostCard1";
import Router from "next/router";
import Layout from "../components/Layout";

function Dummy() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { selectedTag,mainPosts, hasMorePost, loadPostLoading, id , object_TagsData } = useSelector((state) => state.post);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.replace('/'); // push와 다르게 replace는 이전 기록 자체를 지워버리기에 이자리에 더 적합하다.
    }
  }, [me && me.id]);

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
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

  if (!me) {
    return '내 정보 로딩중...';
  }

  return (
    <>
      <Head>
        <title>물건을 빌려줘 | 우리동네 렌탈대장</title>
      </Head>
      <Layout>
        <Tags tagsData={object_TagsData} boardNum={1}/>
        {mainPosts.map((post) => <PostCard1 key={post.id} post={post} />)}
      </Layout>
    </>
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

export default Dummy;
