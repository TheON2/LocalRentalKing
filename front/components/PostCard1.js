import React, { useCallback } from 'react';
import 'antd/dist/antd.css';
import { Card } from 'antd';

const gridStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
};

const PostCard1 = ({ post }) => {
  const onPage = useCallback(() => {
    Router.push(`/post/${post.Id}`);
  }, [post.Id]);

  // const onProfile = useCallback(() => {
  //   Router.push(``)
  // })

  return (
    <div onClick={onPage}>
      <Card.Grid style={gridStyle}>
        <div>
          <p style={{ fontSize: '1.05rem' }}>{post.title}</p>
          <p>렌탈요금: {post.price !== null ? post.price : '협의'}</p>
        </div>
        <div>
          <p>작성자: {post.nickname}</p>
          <p>{post.createAt || 0}분전</p>
        </div>
      </Card.Grid>
    </div>
  );
};

export default PostCard1;
