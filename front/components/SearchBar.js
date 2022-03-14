import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppLayout from '../components/AppLayout/AppLayout';
import {Button, Col, Dropdown, Form, Input, Menu, Row, Select} from "antd";
import 'antd/dist/antd.css';
import {REMOVE_IMAGE, SEND_DUMMYPOST_REQUEST, UPDATE_SEARCH, UPLOAD_IMAGES_REQUEST} from "../reducers/post";
import Router from "next/router";
import useInput from "../hooks/useInput";
import Layout from "../components/Layout";
import Navbar from "react-bootstrap/Navbar";
import logo from "../components/logo2.png";
import {
  AimOutlined,
  CloseOutlined,
  DownOutlined,
  FormOutlined,
  MailOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined
} from "@ant-design/icons";
import {MenuItems} from "../components/MenuItems";
import Link from "next/link";
import SearchLocation from "../components/SearchLocation";

const {TextArea} = Input;
const {Option} = Select;


function SearchBar(){
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a onClick={() => {
        setSelect("닉네임")
      }}>닉네임</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a onClick={() => {
        setSelect("글제목")
      }}>글제목</a>
    </Menu.Item>
    <Menu.Item key="2">
      <a onClick={() => {
        setSelect("글내용")
      }}>글내용</a>
    </Menu.Item>
  </Menu>

)

const [select, setSelect] = useState("글제목");
const onCategory = useCallback((value) => {
  setSelect(value);
}, []);

const [searchword, onSearchWord,setSearchWord] = useInput("asdfasdf");

useEffect(() => {
  console.log(select);
}, [select]);

useEffect(() => {
  console.log(searchword);
}, [searchword]);
  const dispatch = useDispatch();

  const onSearching = useCallback(() => {
    dispatch({
      type:UPDATE_SEARCH,
      data:{select:select, searchword:searchword,}
    });
    Router.push(`/search/${select}*${searchword}`,undefined,{ shallow:true });
  }, [select,searchword]);

  return (
    <div style={{width: "100%"}}>
      <div>
        <div>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" >
              {select} <DownOutlined/>
            </a>
          </Dropdown>
        </div>
        <Input.Search placeholder={"지역, 상품명 입력"} value={searchword} onChange={onSearchWord} onSearch={onSearching}/>
        <div style={{paddingTop: "3px", paddingLeft: "115px"}}>
          <SearchOutlined onClick={onSearching}/>
        </div>
      </div>
    </div>
  )
}

export default SearchBar;
