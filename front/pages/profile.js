import React, {useEffect} from 'react';
import Head from 'next/head';
import {useDispatch, useSelector} from 'react-redux';
import Router from 'next/router';
import {END} from 'redux-saga';
import {Avatar, Card} from 'antd';
import Link from 'next/link';
import AppLayout from '../components/AppLayout/AppLayout';
import {LOAD_MY_INFO_REQUEST, LOAD_USERS_REQUEST} from '../reducers/user';
import wrapper from '../store/configureStore';
import axios from "axios";
import Layout from "../components/Layout";
import PostCard2 from "../components/PostCard2";
import {LOAD_POST_REQUEST, UPDATE_BOARD, UPDATE_TAG} from "../reducers/post";
import ProfileCard from "../components/ProfileCard";
import styled from "styled-components";

const PostCarDiv2 = styled.div`
  width: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  // justify-content:center;
  
`;

function Profile() {
  const { me , usersInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const style = {
    borderRadius: '2rem',
    marginBottom: '20px',
  };

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
  }, []);

  // useEffect(() => {
  //   if (!(me && me.id )) {
  //     alert('로그인 후 이용 가능 합니다.');
  //     Router.replace('/loginpage'); // push와 다르게 replace는 이전 기록 자체를 지워버리기에 이자리에 더 적합하다.
  //   }
  // }, [me && me.id]);

  if (!me) {
    return '내 정보 로딩중...';
  }

  return (
    <>
      <Head>
        <title>내 프로필 | 우리동네 렌탈대장</title>
      </Head>
      { me &&
        <Layout>

          <div><br/></div>

          <ProfileCard userInfo={me}/>

        </Layout>
      }
    </>
  );
}

export default Profile;
