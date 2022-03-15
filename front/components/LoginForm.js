import React, { useCallback, useEffect } from "react";
import Link from "next/link";
import styled, { createGlobalStyle } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import { loginRequestAction } from "../reducers/user";
import Router from "next/router";
import { Form, Input, Button, Checkbox } from "antd";
import logo from "./logo2.png";
import { UserOutlined, CloseOutlined, LockOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const ContainerDiv = styled.div`
  width: 460px;
  height: 310px;
  border: solid #c6c6c6;
  border-radius: 10px;
  // background:red;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 80px;

  .ant-form-item-control-input-content {
    padding-left: 140px;
  }
`;

const InputDiv = styled.div`
  width: 420px;
  height: 48px;
  border: solid #dadada;
  border-radius: 5px;
  padding-top: 8px;
  display: flex;
`;
const RegiDiv = styled.div`
  width: 460px;
  height: 50px;
  border: solid #c6c6c6;
  border-radius: 10px;
  margin-top: 20px;
  text-align: center;
  padding-top: 13px;
`;
const GlobalDiv = createGlobalStyle`
  div{
    cursor: pointer;
  }
`;

function LoginForm() {
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const { logInLoading, logInError, logInDone } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (logInError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: logInError,
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  }, [logInError]); // 로그인 에러 화면처리

  useEffect(() => {
    if (logInDone) {
      Router.push("/objectreceive");
    }
  }, [logInDone]); // 로그인 에러 화면처리

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(loginRequestAction({ email, password }));
    // Router.push('/',undefined,{ shallow:true });
  }, [email, password]);

  return (
    <>
      <div>
        <div style={{ paddingLeft: "80px" }}>
          <Link href="/objectreceive">
            <img src={logo} style={{ width: "300px", paddingBottom: "20px" }} />
          </Link>
        </div>
        <ContainerDiv>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onSubmitForm}
            autoComplete="off"
          >
            <InputDiv>
              <div style={{ width: "50px", textAlign: "start" }}>
                <span>
                  <UserOutlined style={{ width: "50px" }} />
                </span>
              </div>
              <div style={{ width: "280px", textAlign: "start" }}>
                <input
                  value={email}
                  onChange={onChangeEmail}
                  type="text"
                  style={{ border: "none", width: "250px" }}
                  placeholder="아이디"
                />
              </div>
              <div style={{ textAlign: "end", width: "70px" }}>
                <button
                  style={{
                    border: "solid 1px",
                    borderRadius: "14px",
                    color: "white",
                  }}
                >
                  <span>
                    <CloseOutlined />
                  </span>
                </button>
              </div>
            </InputDiv>
            <InputDiv>
              <div style={{ width: "50px", textAlign: "start" }}>
                <span>
                  <LockOutlined style={{ width: "50px" }} />
                </span>
              </div>
              <div style={{ width: "280px", textAlign: "start" }}>
                <input
                  value={password}
                  onChange={onChangePassword}
                  type="password"
                  style={{ border: "none", width: "250px" }}
                  placeholder="비밀번호"
                />
              </div>
              <div style={{ textAlign: "end", width: "70px" }}>
                <button
                  style={{
                    border: "solid 1px",
                    borderRadius: "14px",
                    color: "white",
                  }}
                >
                  <span>
                    <CloseOutlined />
                  </span>
                </button>
              </div>
            </InputDiv>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                로그인
              </Button>
            </Form.Item>
          </Form>
        </ContainerDiv>
        <RegiDiv>
          <span>계정이 없으신가요? </span>
          <Link href="signup">
            <a>가입하기</a>
          </Link>
        </RegiDiv>
      </div>
    </>
  );
}

export default LoginForm;
