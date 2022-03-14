import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components'
import {
  UserOutlined,
  MailOutlined,
  SearchOutlined,
  FormOutlined,
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
  AimOutlined,
} from '@ant-design/icons';
import {MenuItems} from './MenuItems';
import {Menu, Dropdown, Row, Col ,Input} from 'antd';
import logo from './logo2.png';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Router from "next/router";
import {logoutRequestAction, UPDATE_LOCAL} from "../reducers/user";
import {useDispatch, useSelector} from "react-redux";
import useInput from "../hooks/useInput";
import SearchLocation from "./SearchLocation";
import {UPDATE_SEARCH} from "../reducers/post";

const Topbar = styled.div`
  padding: 1%;
  width: 100%;
  height: 40px;
  font-size: 0.6em;
  // background: red;
  border-bottom: solid #eeeeee;
  display: flex;
  justify-content: center;;
  background: RGB(255, 255, 255);
  padding: 0 35px;
`;
const TopDiv = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  width: 80%;
  backgounr: blue;
  font-size: 1.6em;
  color: RGB(127, 127, 127);
`;

const NavBar = styled.div`
  width: 100%;
  // background:red;
  height: 146px;
  display: flex;
  // background:yellow;
  border-bottom: solid #eeeeee;
  padding: 0 35px;
  align-items: center;
  flex-wrap: wrap;
`;
const NavBarDiv = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-content: center;
  align-items: center;
  // background:blue;
  padding-left: 200px;
  // justify-content: center;
`;
const GlobalStyle = createGlobalStyle`
  div {
    cursor: pointer;
  }

  input:focus {
    outline: none;
  }

  ul {
    list-style: none;
  }
`;
const SelcectDiv = styled.div`
  color: #212a4b;
  width: 450px;
  height: 30px;
  border: solid #212a4b;
  min-width: 450px;
  display: flex;
  // padding-left:50px;
`;
const SelectDropD = styled.div`
  width: 60px;
  hieght: 30px;
  // background:red;
  padding-top: 4px;
  font-size: 13px;
  font-weight: 600;
  border-right: solid #212a4b;
  align-items: center;
  padding-left: 5px;
  min-width: 60px;

  a {
    color: black;
  }

  a:hover {
    color: black;
  }
`;
const Select = styled.input`
  padding: 1.5%;
  width: 250px;
  hieght: 30px;
  border: none;
  float: left;
  // padding-left:80px;

`;
const ProfileDiv = styled.div`
  width: 400px;
  height: 28px;
  // background:white;
  display: flex;
  padding-left: 50px;
`;
const UserDiv = styled.div`
  width: 120px;
  height: 26px;
  // border-right: solid #e6e6e6;
  :nth-child(2) {
    border-right: solid #e6e6e6;
    border-left: solid #e6e6e6;
  }

  padding-top: 2px;
  padding-left: 28px;
`;
const NavMenu = styled.ul`
  flex-direction: column;
  width: 100%;
  position: absolute;
  // top: 80px;
  // left:-100%;
  transition: all .5s ease;
`;
const NavActive = styled.ul`
  position: absolute;
  z-index: 1;

`;
const MenuLi = styled.li`
  text-align: center;
  padding-top: 40px;
  font-weight: 600;
  font-size: 20px;
  transition: all 0.25s ease;

  :hover {
    transform: scale(1.3, 1.3);
  }


  a {
    color: black;
  }

  a:hover {
    color: black;
  }

`;
const MenuDiv = styled.div`
  width: 200px;
  flex-wrap: wrap;
  padding-top: 30px;
  min-width: 200px;
`;
const LogoDiv = styled.div`
  width: 260px;
  position: absolute;
  padding-top: 25px;
  min-height: 50px;
  // background:red;
`;
const MenuA = styled.div`
  width: 30px;
  padding-top: 90px;
  // minwidth:120px;
`;
const PlaceDiv = styled.div`
  position: fixed;
  width: 150px;
  // background:red;
  height: 30px;
  top: 200px;
  right:180px;
  // left:200px;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  // :hover {
  //   transform: scale(1.3, 1.3);
  // }
  justify-content:left;
  display: flex;
  flex-wrap: wrap;
`;
const PostDiv = styled.div`
  width:100%;
  // background:blue;
`;
const LocalDiv = styled.div`
    
`;

const C = styled.div`
  width:120px;
`;

function Layout({children}) {
  const dispatch = useDispatch();
  const {me, location} = useSelector((state) => state.user);
  const [isOpen, setMenu] = useState(false);
  const [profile, SetProfile] = useState(false);
  const [place, SetPlace] = useState(false);
  const [select, setSelect] = useState("글제목");
  const [searchword, onSearchWord,setSearchWord] = useInput("");

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a onClick={() => {
          setSelect("글제목")
        }}>글제목</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a onClick={() => {
          setSelect("글내용")
        }}>글내용</a>
      </Menu.Item>
    </Menu>
  )

  const PlaceClick = () => {
    if(place == false){
      SetPlace(true);
      console.log(place);
    }
    if(place == true){
      SetPlace(false);
    }
  }

  const toggleMenu = () => {
    setMenu(!isOpen);
  }

  const goProfile = () => {
    SetProfile(true);
    console.log(profile);
    Router.push('/profile',undefined,{ shallow:true });
  }

  const onWrite = useCallback(() => {
    Router.push('/write',undefined,{ shallow:true });
  }, []);

  const onLogIn = useCallback(() => {
    Router.push('/loginpage',undefined,{ shallow:true });
  }, []);

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
    Router.push('/', undefined, { shallow: true });
  }, []);

  const onSearching = useCallback(() => {
    dispatch({
      type:UPDATE_SEARCH,
      data:{select:select, searchword:searchword,}
    });
    Router.push(`/search/${select}*${searchword}`, null, { shallow: true });
  }, [select,searchword]);

  return (
    <div style={{width: "100%"}}>
      <div style={{position: "relative", width: "100%"}}>
        <GlobalStyle/>
        <div>
          <Topbar>
            <TopDiv>
              {!me ?
                (<div onClick={onLogIn}>로그인/회원가입</div>) :
                (<div onClick={onLogOut}>로그아웃</div>)}
              <Link href='/profile'>
              <div style={{paddingLeft: "20px"}}>
                내 프로필
              </div>
              </Link>
            </TopDiv>
          </Topbar>
          <NavBar>
            <NavBarDiv>
              <MenuDiv>
                <LogoDiv>
                    <Link href='/'>
                    <img
                      alt=""
                      src={logo}
                      width="245px;"
                      height="45px"
                      className="d-inline-block align-top"
                      style={{paddingTop: "10px"}}
                    />
                    </Link>
                </LogoDiv>
                <MenuA style={{paddingBottom: "20px"}}>
                  {!isOpen ?
                    <MenuOutlined style={{fontSize: "20px"}} onClick={toggleMenu}/>
                    :
                    <CloseOutlined style={{fontSize: "20px"}} onClick={toggleMenu}/>
                  }
                  {isOpen ?
                    <NavActive>
                      {MenuItems.map((item, index) => {
                        return (
                          <>
                            {index === 0 &&
                            <Link href="/objectrecieve"><MenuLi key={"a"}><a>{item.title}</a></MenuLi></Link>}
                            {index === 1 &&
                            <Link href="/objectsend"><MenuLi key={"b"}><a>{item.title}</a></MenuLi></Link>}
                            {index === 2 &&
                            <Link href="/talentrecieve"><MenuLi key={"c"}><a>{item.title}</a></MenuLi></Link>}
                            {index === 3 &&
                            <Link href="/talentsend"><MenuLi key={"d"}><a>{item.title}</a></MenuLi></Link>}
                            {index === 4 &&
                            <Link href="/cooperate"><MenuLi key={"e"}><a>{item.title}</a></MenuLi></Link>}
                            {index === 5 &&
                            <Link href="/playground"><MenuLi key={"f"}><a>{item.title}</a></MenuLi></Link>}
                          </>
                        )
                      })}
                    </NavActive> : <NavMenu/>
                  }
                </MenuA>
              </MenuDiv>
              <div style={{paddingLeft: "160px"}}>
                <SelcectDiv>
                  <SelectDropD>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a className="ant-dropdown-link" >
                        {select} <DownOutlined/>
                      </a>
                    </Dropdown>
                  </SelectDropD>
                  <Select placeholder={"지역, 상품명 입력"} value={searchword} onChange={onSearchWord}/>
                  <div style={{paddingTop: "3px", paddingLeft: "115px"}}>
                    <SearchOutlined onClick={onSearching}/>
                  </div>
                </SelcectDiv>
              </div>
              <ProfileDiv>
                <UserDiv onClick={goProfile}>
                  <UserOutlined/> 내프로필
                </UserDiv>
                <UserDiv>
                  <MailOutlined/> 알림톡
                </UserDiv>
                <UserDiv onClick={onWrite}>
                  <FormOutlined/> 글 쓰기
                </UserDiv>
              </ProfileDiv>
            </NavBarDiv>
          </NavBar>
        </div>
        <PostDiv>
          <div style={{marginTop: 0, zIndex: 5 , width: '100%'}}>
            <Row gutter={8}>
              <Col xs={7} md={6}/>
              <Col xs={13} md={13}>
                {children}
              </Col>
              <Col xs={6} md={5}/>
            </Row>
          </div>
        </PostDiv>
        <PlaceDiv onClick={PlaceClick}>
          <C>
            <AimOutlined style={{paddingRight: "10px"}}/>
            {!place ?
              <span>동네 설정</span> : <span>재설정</span>}
          </C>
          {place ?
            <div>
              <SearchLocation/></div>:
            <LocalDiv>
              {location}
            </LocalDiv>
          }
        </PlaceDiv>
      </div>
    </div>
  )
}

export default Layout;
