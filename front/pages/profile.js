import React, {useEffect} from 'react';
import Head from 'next/head';
import {useSelector} from 'react-redux';
import Router from 'next/router';
import {END} from 'redux-saga';
import {Avatar, Card} from 'antd';
import Link from 'next/link';
import AppLayout from '../components/AppLayout/AppLayout';
import {LOAD_MY_INFO_REQUEST, LOAD_USERS_REQUEST} from '../reducers/user';
import wrapper from '../store/configureStore';

function Profile() {
  const { me , usersInfo } = useSelector((state) => state.user);

  const style = {
    borderRadius: '2rem',
    marginBottom: '20px',
  };

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
      alert("로그인 후 이용해주세요");
    }
  }, [me && me.id]);

  if (!me) {
    return '내 정보 로딩중...';
  }

  return (
    <>
      <Head>
        <title>내 프로필 | 우리동네 렌탈대장</title>
      </Head>
      <AppLayout>


        <Card>
          <Card.Meta
            avatar={<Avatar>{me.nickname[0]}</Avatar>}
            title={me.nickname}
          />
        </Card>

        {usersInfo.map((c) => (
          <Link href={`/user/${c.id}`} prefetch={false}>
            <Card style={style}>
              <Card.Meta
                avatar={(
                  <a><Avatar>{c.nickname[0]}</Avatar></a>
                )}
                title={c.nickname}
              />
              <br />
            </Card>
          </Link>
        ))}

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
  // context.store.dispatch({
  //   type: LOAD_POST_REQUEST,
  // });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Profile;
