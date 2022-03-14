import React, { useCallback, useEffect } from 'react';
import {Button, Col, Form, Input, Row} from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { loginRequestAction } from '../reducers/user';
import Router from "next/router";
import LoginForm from "../components/LoginForm";

function Loginpage() {

  return (
    <Row gutter={8}>
    <Col xs={24} md={10}>
      <img src="main.png" style={{ height: 950 }}/>
    </Col>
    <Col xs={24} md={10}>
      <h1>우리동네 렌탈대장을 지금 이용해 보세요!</h1>
      <LoginForm style={{ marginTop: 300 }} />
    </Col>
    <Col xs={24} md={4}>
    </Col>
  </Row>
  );
}

export default Loginpage;
