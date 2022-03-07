import PropTypes from 'prop-types';
import {Button, Col, Menu, Row,Input} from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import {LeftSidebar, Navbar, RightSidebar, SearchInput, SidebarDiv, SidebarLi, SidebarUl, WriteButton} from './styles';
import { createGlobalStyle } from 'styled-components';
import { fixControlledValue } from 'antd/lib/input/Input';
function AppLayout() {
//   const [searchInput, onChangeSearchInput] = useInput('');

//   const dispatch = useDispatch();
const GlobalStyle = createGlobalStyle`
	body {
		padding: 0;
		margin: 0;
        background:#e9e9e9;
	}
    a {
        color:white;
    }
`;
  const writeButtonStyle = {
    left:"5%",
    top:"25%",
    zIndex:20,
  };

//   const onSearch = useCallback(() => {
//     Router.push(`/hashtag/${searchInput}`);
//   }, [searchInput]);

//   const onWrite = useCallback(() => {
//     Router.push('/write');
//   }, []);

//   const onLogOut = useCallback(() => {
//     dispatch(logoutRequestAction());
//   }, []);

  return (
      
    <div>
        <GlobalStyle />
      <div style={{ position: 'relative' }}>
        <Navbar>
        <SearchInput  value="내용을 입력해주세요" enterButton/>
        <Button style={writeButtonStyle} >글쓰기</Button>
        </Navbar>
        <div>
          <LeftSidebar>
            <SidebarDiv>
              <SidebarUl>
                  <SidebarLi>
                    <a> 우리동네 렌탈대장</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 물건을 빌려줘</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 물건을 빌려줄게</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 힘을 빌려줘</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 힘을 빌려줄게</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a > 같이 하자</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 동네 놀이터</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 동네 친구 찾기</a>
                  </SidebarLi>
                  <SidebarLi>
                    <a> 프로필</a>
                  </SidebarLi>
                <div >
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
           
          </RightSidebar>
        </div>
      </div>
      <div style={{ marginTop: 100, zIndex: 5 }}>
        <Row gutter={8}>
          <Col xs={7} md={7} />
          <Col xs={11} md={11}>
            
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