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
`;

export const LeftSidebar = styled.div`
  position: fixed;
  float: left;
  top: 0px;
  left: 10%;
  width: 200px;
  height: 1000px;
  background: #f3f5fa15;
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
  background: #f3f5fa15;
  padding: 0px 0;
  overflow: hidden;
  color: black;
  font-size: 20px;
  z-index: 10;
`;

export const RightSidebar = styled.div`
  position: fixed;
  float: left;
  top: 10px;
  right: 200px;
  background: #f3f5fa15;
  padding: 0px 0;
  overflow: hidden;
  color: black;
  font-size: 20px;
  z-index: 10;
`;

export const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;