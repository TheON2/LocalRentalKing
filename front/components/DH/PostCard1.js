import React, {useCallback} from 'react';
import 'antd/dist/antd.css';
import {Card} from 'antd';
import Router from 'next/router';
import Link from 'next/link';

const gridStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  cursor:'pointer',
  margin:'10px',
};
const PostCard1 = ({post}) => {

  const onPage = useCallback(()=>{
    Router.push(`/post/${post.id}`);
  },[post.id]);

  return (
    <div onClick={onPage}>
      <Card.Grid style={gridStyle}>
        <div>
          <p style={{fontSize: '1.05rem'}}>{post.title}</p>
          <p>렌탈요금: {post.price}</p>
        </div>
        <div>
          <p>작성자: {post.nickname}</p>
          <p>{post.createAt || 0}분전</p>
        </div>
      </Card.Grid>

      {/*{ post.boardNum === 1||2||3||4 &&*/}
      {/*  <Card.Grid style={gridStyle}>*/}
      {/*    <div>*/}
      {/*      <p style={{fontSize: '1.05rem'}}>{post.title}</p>*/}
      {/*      <p>렌탈요금: {post.price}</p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <p>작성자: {post.nickname}</p>*/}
      {/*      <p>{post.createAt || 0}분전</p>*/}
      {/*    </div>*/}
      {/*  </Card.Grid>*/}
      {/*}*/}
      {/*{post.boardNum === 5 && post.category==="1+1"? // 같이하자 게시판에서 1+1 태그 게시물일 경우*/}
      {/*  <Card.Grid style={gridStyle}>*/}
      {/*    <div>*/}
      {/*      <p style={{fontSize: '1.05rem'}}>{post.title}</p>*/}
      {/*      <p>렌탈요금: {post.price}</p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <p>작성자: {post.nickname}</p>*/}
      {/*      <p>{post.createAt || 0}분전</p>*/}
      {/*    </div>*/}
      {/*  </Card.Grid> : null*/}
      {/*}*/}
      {/*{post.boardNum === 5 && post.category==="배달"? // 같이하자 게시판에서 배달 태그 게시물일 경우*/}
      {/*  <Card.Grid style={gridStyle}>*/}
      {/*    <div>*/}
      {/*      <p style={{fontSize: '1.05rem'}}>{post.title}</p>*/}
      {/*      <p>렌탈요금: {post.price}</p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <p>작성자: {post.nickname}</p>*/}
      {/*      <p>{post.createAt || 0}분전</p>*/}
      {/*    </div>*/}
      {/*  </Card.Grid> : null*/}
      {/*}*/}
      {/*{post.boardNum === 5 && post.category==="공동구매"? // 같이하자 게시판에서 공동구매 태그 게시물일 경우*/}
      {/*  <Card.Grid style={gridStyle}>*/}
      {/*    <div>*/}
      {/*      <p style={{fontSize: '1.05rem'}}>{post.title}</p>*/}
      {/*      <p>렌탈요금: {post.price}</p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <p>작성자: {post.nickname}</p>*/}
      {/*      <p>{post.createAt || 0}분전</p>*/}
      {/*    </div>*/}
      {/*  </Card.Grid> : null*/}
      {/*}*/}
      {/*{post.boardNum === 5 && post.category==="기타"? // 같이하자 게시판에서 기타 태그 게시물일 경우*/}
      {/*  <Card.Grid style={gridStyle}>*/}
      {/*    <div>*/}
      {/*      <p style={{fontSize: '1.05rem'}}>{post.title}</p>*/}
      {/*      <p>렌탈요금: {post.price}</p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <p>작성자: {post.nickname}</p>*/}
      {/*      <p>{post.createAt || 0}분전</p>*/}
      {/*    </div>*/}
      {/*  </Card.Grid> : null*/}
      {/*}*/}
      {/*{ post.boardNum === 6 && //동네 놀이터 게시판의 경우 [태그에 따라 레이아웃 나누실거면 똑같이 조건문 더 늘리시면되용]*/}
      {/*<Card.Grid style={gridStyle}>*/}
      {/*  <div>*/}
      {/*    <p style={{fontSize: '1.05rem'}}>{post.title}</p>*/}
      {/*    <p>렌탈요금: {post.price}</p>*/}
      {/*  </div>*/}
      {/*  <div>*/}
      {/*    <p>작성자: {post.nickname}</p>*/}
      {/*    <p>{post.createAt || 0}분전</p>*/}
      {/*  </div>*/}
      {/*</Card.Grid>*/}
      {/*}*/}
    </div>
  );
};

export default PostCard1;
