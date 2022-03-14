import React from 'react';
import {Card} from 'antd';
import moment from 'moment';
import styled, { createGlobalStyle } from "styled-components";
import logo from "../public/nouser.png";
const Pdiv = styled.div`
    color:black;
    display:flex;
    width:100%;
    height:20px;
`;
const GradeDiv = styled.div`
    width:30%;
    height:22px;
    border-radius:5px;
    background:#3598db;
    color:white;
    margin-left:5px;
`;
const Pcdiv = styled.div`
    width:20%;
    color:black;
`;
const Cdiv = styled.div`
    margin-left:30px;
    width:20%;
    font-size:1px;
`;
const Wdiv = styled.div`
    color:black;
    font-weight:800;
`;
moment.locale('ko');
function ProfileCard({userInfo}) {

  let imageUrl = null;

  if(userInfo && userInfo.profileImg){
    imageUrl = `http://localhost:3065/${userInfo.profileImg}`;
  }else{
    imageUrl = logo;
  }

  return (
    <div style={{paddingLeft:""}}>
      {userInfo &&
      <Card
        hoverable
        style={{ width: 280 }}
        cover={<img alt="example"src={imageUrl}/>}
        actions={[
          <Wdiv>
            렌탈
            <br/>
            {userInfo.ProdPosts.length+userInfo.PowerPosts.length+userInfo.TogetherPosts.length}
          </Wdiv>,
          <Wdiv>
            게시글
            <br/>
            14
          </Wdiv>,
          <Wdiv>
            추천
            <br/>
            14
          </Wdiv>,
          <Wdiv>
            비추천
            <br/>
            14
          </Wdiv>
        ]}
      >
        <Pdiv>
          <Pcdiv>
            {userInfo.nickname}
          </Pcdiv>
          <GradeDiv>
            {userInfo.grade === "Normal" ? "일반회원" : "어드민" }
          </GradeDiv>
          <Cdiv>
            {userInfo.createAt}
          </Cdiv>
        </Pdiv>
        <div style={{textAlign:"left"}}>
          <h4>{userInfo.email}</h4>
        </div>
        <div style={{textAlign:"left"}}>
          <h4>{userInfo.greeting}</h4>
        </div>
      </Card>}
    </div>
  );
}
ProfileCard.propTypes = {
};
export default ProfileCard;