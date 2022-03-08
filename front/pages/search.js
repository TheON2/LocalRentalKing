import React, {useCallback, useState} from 'react';
import Head from 'next/head';

import AppLayout from '../components/AppLayout/AppLayout';
import {SearchInput} from "../components/AppLayout/styles";
import Router from "next/router";
import useInput from "../hooks/useInput";
import Link from "next/link";
import {Avatar, Card} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST, LOAD_USERS_REQUEST} from "../reducers/user";
import axios from "axios";
import {END} from "redux-saga";
import wrapper from "../store/configureStore";

function Search() {

  const [searchInput, onChangeSearchInput] = useInput('');

  const {me, usersInfo, userInfo} = useSelector((state) => state.user);

  const [findId, setFindId] = useState(false);

  const dispatch = useDispatch();

  const onSearch = useCallback(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
      data: searchInput, // 검색할 유저 아이디
    });
    setFindId(true);
    searchInput("");
  }, [searchInput]);

  const onClickProfile = useCallback(() => {
    Router.push(`/profile/${searchInput}`);
  }, [searchInput]);

  const style = {
    borderRadius: '2rem',
    marginBottom: '20px',
  };

  return (
    <>
      <AppLayout>

        <Head>
          <title>동네친구 찾기 | 우리동네 렌탈대장</title>
        </Head>

        <div>
          <h1>친구의 아이디를 입력하세요</h1>
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
          {/*  아이디/별명 선택박스 */}
        </div>

        <div>
          {usersInfo.map((c) => (
            <Link href={`/user/${c.id}`} prefetch={false}>
              <Card style={style}>
                <Card.Meta
                  avatar={(
                    <a><Avatar>{c.nickname[0]}</Avatar></a>
                  )}
                  title={c.nickname}
                />
                <br/>
              </Card>
            </Link>
          ))}
        </div>

        {/*<div>*/}
        {/*<Link href={`/user/${userInfo.id}`} prefetch={false}>*/}
        {/*  {findId && <ProfileCard user={userInfo} />}*/}
        {/*</Link>*/}
        {/*</div>*/}
        {/* profilecard를 완성하고 찾아낸 id를 입력하여 렌더링한다. */}

      </AppLayout>
    </>
  );
}


export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_USERS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Search;
