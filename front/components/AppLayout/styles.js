import styled from 'styled-components';
import {Input} from "antd";

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
`;

export const SidebarDiv = styled.div`
  left: 0px;
  border-radius: 2rem;
  color: black;
  width: 300px;
  height: 1500px;
  font-weight: bold;
  line-height: 250%;
  background: skyblue !important;
`;

export const LeftSidebar = styled.div`
  position: fixed;
  float: left;
  top: 0px;
  left: 9%;
  width: 220px;
  height: 1000px;
  background: skyblue !important;
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
  left: 29%;
  width: 1800px;
  background: skyblue !important;
  padding: 0px 0;
  overflow: hidden;
  color: black;
  font-size: 20px;
  z-index: 10;
`;

export const RightSidebar = styled.div`
  position: fixed;
  top:1%;
  left:40%;
  padding: 0px 0;
  overflow: hidden;
  color: black;
  font-size: 20px;
  z-index: 10;
`;

export const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;