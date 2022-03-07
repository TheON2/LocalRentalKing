import React from 'react';
import {Card} from 'antd';
import moment from 'moment';
import styled, { createGlobalStyle } from "styled-components";
import {EditOutlined} from "@ant-design/icons";
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

function ProfileCard() {
    
    const userInfo = [
        {nickname:"김도원", grade:"일반회원",email:"theone",greeting:"안녕하세요 ^^ 많은 거래 해봐요~",createAt:"2020.06.14"},
        {nickname:"b", grade:"Normal",email:"b@b",greeting:"안녕하세요b"},
        {nickname:"c", grade:"Normal",email:"c@b",greeting:"안녕하세요c"},
        {nickname:"root", grade:"admin",email:"d@b",greeting:"안녕하세요r"},
    ];
    console.log(userInfo[0].nickname);
  return (
    <div style={{paddingLeft:"40%"}}>
      <Card
         hoverable
        style={{ width: 280 }}
        cover={<img alt="example"src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"/>}
        actions={[
            <Wdiv>
                렌탈
                <br/>
                14
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
        {userInfo[0].nickname}
        </Pcdiv>
        <GradeDiv>
        {userInfo[0].grade}
        </GradeDiv>
        <Cdiv>
        {userInfo[0].createAt}
        </Cdiv>
        </Pdiv>
        <div style={{textAlign:"left"}}>
            <h4>@{userInfo[0].email}</h4>
        </div>
        <div style={{textAlign:"left"}}>
        <h4>{userInfo[0].greeting}</h4>
        </div>
      </Card>
    </div>
  );
}

ProfileCard.propTypes = {
};

export default ProfileCard;