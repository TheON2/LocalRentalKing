import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { END } from 'redux-saga';
import { Col, Row } from 'antd';
import AppLayout from '../components/AppLayout/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import LoginForm from '../components/LoginForm';

function Home() {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading, reTweetError, id } = useSelector((state) => state.post);

  useEffect(() => {
    if (reTweetError) {
      alert(reTweetError);
    }
  }, [reTweetError]);

  const [ref, inView] = useInView();

  useEffect(
    () => {
      if (inView && hasMorePost && !loadPostLoading) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
          type: LOAD_POST_REQUEST,
          lastId,
        });
      }
    },
    [inView, hasMorePost, loadPostLoading, mainPosts, id],
  );

  return (

    <div>{me ? (
      <AppLayout>
        {me && <PostForm />}
        {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        <div ref={hasMorePost && !loadPostLoading ? ref : undefined} />
      </AppLayout>
    ) : (
      <Row gutter={8}>
        <Col xs={24} md={10}>
          <img src="main.png" style={{ height: 950 }} />
        </Col>
        <Col xs={24} md={10}>
          <h1>오늘은 무슨 일이 일어났나요?</h1>
          <LoginForm style={{ marginTop: 300 }} />
        </Col>
        <Col xs={24} md={4}>
          <a
            href="https://github.com/TheON2"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by TheON2
          </a>
        </Col>
      </Row>
    )}
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 기존 방식에서는 브라우저에서 쿠키를 만들어주기 때문에 각각의 독립된 브라우저에서 쿠키를 브라우저 >> 프론트 >> 백 으로 보내는 삼중구조지만
  // 쿠키가 다른 사용자에게 넘어갈 일이 없었으나 , SSR은 브라우저에서 쿠키를 동봉받아 프론트서버에서 쿠키를 백서버에 전달하는 이중구조 방식으로 , 잘못하면 내 로그인 쿠키로 다른 사용자가 접속하게 될 수 있기때문에
  // 이를 방지하기 위하여 우선 헤더에 들어간 쿠키를 공백으로 지워주고 로직을 시작한다.
  if (context.req && cookie) { // 타 유저간 쿠키가 공유되는 문제를 방지하기 위함
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
