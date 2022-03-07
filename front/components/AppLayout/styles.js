import styled, { createGlobalStyle } from 'styled-components';
import {Button, Input} from "antd";

export const SidebarImg = styled.img`
  width: 40px;
  role: presantation;
`;

export const SidebarUl = styled.ul`
  list-style-type: none;
  line-height: 1;
  color:black;
  `;

export const SidebarLi = styled.li`
  cursor: pointer;
  transition: all 0.25s ease;
  line-height: 70px;
  :hover {
    transform: scale(1.3, 1.3);
  }
  color:black;
  margin-right:40%;
`;

export const SidebarDiv = styled.div`
  left: 0px;
  color: black;
  width: 300px;
  height: auto;
  font-weight: bold;
  line-height: 250%;
  background: #3598db !important;
`;

export const LeftSidebar = styled.div`
  position: fixed;
  float: left;
  top: 0px;
  left: 10%;
  width: 15%;
  height: auto;
  background: #3598db !important;
  padding: 0px 0;
  overflow: hidden;
  color: black;
  font-size: 20px;
  z-index: 10;
`;

export const Navbar = styled.div`
  position: fixed;
  float: left;
  top: 0px;
  left: 25%;
  width: 65%;
  height:8%;
  background: #3598db !important;
  overflow: hidden;
  z-index: 10;
  display:flex;
`;

export const RightSidebar = styled.div`
  position: fixed;
  top:1%;
  left:40%;
  padding: 0 auto;
  overflow: hidden;
  color: black;
  font-size: 20px;
  z-index: 10;
  padding-right:500px;
`;

export const SearchInput = styled(Input.Search)`
  padding-top:20px;
  width:50%;
  float:left;
`;

// export const SearchInput = styled(Input.span)`
//   background:#f0f0f0;
// `;


