import React from 'react';
import {Card} from 'antd';
import moment from 'moment';
import PostImages from './PostImages';

moment.locale('ko');

function ProfileCard({ userInfo }) {

  return (
    <div>
      <Card
        cover={userInfo.ProfileImage ? <PostImages images={userInfo.ProfileImage} /> : <PostImages images={userInfo.ProfileImage} />}
        actions={[
          <a>렌탈<br/>{userInfo.userRental.length}</a>,
          <a>게시글<br/>{userInfo.userWrite.length}</a>,
          <a>추천<br/>{userInfo.follower.length}</a>,
          <a>비추천<br/>{userInfo.unfollower.length}</a>,
        ]}
      />
      <div>
        <h4>{userInfo.nickname}</h4>
        <a>{userInfo.grade}</a>
        <a>{userInfo.createdAt}</a>
        <a>@{userInfo.email}</a>
        <a>{userInfo.greeting}</a>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
};

export default ProfileCard;
