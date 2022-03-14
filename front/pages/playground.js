import React, {useEffect} from 'react';
import wrapper from '../store/configureStore';
import Head from 'next/head';
import {useDispatch, useSelector} from 'react-redux';
import {END} from 'redux-saga';
import {useInView} from "react-intersection-observer";

import AppLayout from '../components/AppLayout/AppLayout';

import {LOAD_MY_INFO_REQUEST} from '../reducers/user';
import {LOAD_POST_REQUEST, UPDATE_BOARD, UPDATE_TAG} from '../reducers/post';
import Tags from "../components/Tags";
import PostCard1 from "../components/PostCard1";
import axios from "axios";
import Router from "next/router";
import Layout from "../components/Layout";

function PlayGround() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { play_tagsData,selectedTag,mainPosts, hasMorePost, loadPostLoading, id } = useSelector((state) => state.post);

  useEffect(() => {
    if (!(me && me.id)) {
      alert('로그인 후 이용 가능 합니다.');
      Router.replace('/loginpage'); // push와 다르게 replace는 이전 기록 자체를 지워버리기에 이자리에 더 적합하다.
    }
  }, [me && me.id]);

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
      data: 6,
    });
    dispatch({
      type: LOAD_POST_REQUEST,
      data: "전체",
      boardNum: 6,
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id; // 인피니트 스크롤 구현을 위해 프론트 서버의 현재 렌더링중인 게시글들중 가장 아래 게시물의 게시넘버를 lastId로
          console.log(selectedTag);
          dispatch({
            type: LOAD_POST_REQUEST,
            data:selectedTag,
            boardNum:6,
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
        <title>동네 놀이터 | 우리동네 렌탈대장</title>
      </Head>
      <Layout>
        <Tags tagsData={play_tagsData} boardNum={6}/>
        {mainPosts.map((post) => <PostCard1 key={post.id} post={post} />)}
      </Layout>
    </>
  );
}

export default PlayGround;
