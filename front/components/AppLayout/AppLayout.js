import Link from "next/link";
import PropTypes from "prop-types";
import { Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../hooks/useInput";
import React, { useCallback } from "react";
import Router from "next/router";

import {
  LeftSidebar,
  Navbar,
  RightSidebar,
  SearchInput,
  SidebarDiv,
  SidebarLi,
  SidebarUl,
  WriteButton,
} from "./styles";

import { logoutRequestAction } from "../../reducers/user";

function AppLayout({ children }) {
  const [searchInput, onChangeSearchInput] = useInput("");

  const dispatch = useDispatch();

  const writeButtonStyle = {
    left: "70%",
    top: "2%",
    zIndex: 20,
  };

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`, undefined, { shallow: true });
  }, [searchInput]);

  const onWrite = useCallback(() => {
    Router.push("/write", undefined, { shallow: true });
  }, []);

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
    Router.push("/", undefined, { shallow: true });
  }, []);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <Navbar>
          <Menu mode="horizontal">
            <Menu.Item key={1}>
              <Link href="/">
                <a>
                  <h2>홈</h2>
                </a>
              </Link>
            </Menu.Item>
          </Menu>
        </Navbar>
        <div>
          <LeftSidebar>
            <SidebarDiv>
              <SidebarUl>
                <Link href="/">
                  <SidebarLi>
                    <a> 우리동네 렌탈대장</a>
                  </SidebarLi>
                </Link>
                <Link href="/objectreceive">
                  <SidebarLi>
                    <a> 물건을 빌려줘</a>
                  </SidebarLi>
                </Link>
                <Link href="/objectsend">
                  <SidebarLi>
                    <a> 물건을 빌려줄게</a>
                  </SidebarLi>
                </Link>
                <Link href="/talentreceive">
                  <SidebarLi>
                    <a> 힘을 빌려줘</a>
                  </SidebarLi>
                </Link>
                <Link href="/talentsend">
                  <SidebarLi>
                    <a> 힘을 빌려줄게</a>
                  </SidebarLi>
                </Link>
                <Link href="/cooperate">
                  <SidebarLi>
                    <a> 같이 하자</a>
                  </SidebarLi>
                </Link>
                <Link href="/playground">
                  <SidebarLi>
                    <a> 동네 놀이터</a>
                  </SidebarLi>
                </Link>
                <Link href="/search">
                  <SidebarLi>
                    <a> 동네 친구 찾기</a>
                  </SidebarLi>
                </Link>
                <Link href="/profile">
                  <SidebarLi>
                    <a> 프로필</a>
                  </SidebarLi>
                </Link>
                <div onClick={onLogOut}>
                  <SidebarLi>
                    <a> 로그아웃</a>
                  </SidebarLi>
                </div>
              </SidebarUl>
            </SidebarDiv>
          </LeftSidebar>
        </div>
        <div>
          <RightSidebar>
            <SearchInput
              enterButton
              value={searchInput}
              onChange={onChangeSearchInput}
              onSearch={onSearch}
            />
          </RightSidebar>
          <Button style={writeButtonStyle} onClick={onWrite}>
            글쓰기
          </Button>
        </div>
      </div>
      <div style={{ marginTop: 100, zIndex: 5 }}>
        <Row gutter={8}>
          <Col xs={7} md={7} />
          <Col xs={11} md={11}>
            {children}
          </Col>
          <Col xs={6} md={6} />
        </Row>
      </div>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
