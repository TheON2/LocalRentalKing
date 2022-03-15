import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Button, Checkbox, Form, Input } from "antd";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import useInput from "../hooks/useInput";
import AppLayout from "../components/AppLayout/AppLayout";
import { SIGN_UP_REQUEST, UPDATE_LOCAL } from "../reducers/user";
import Layout from "../components/Layout";
import SearchLocation from "../components/SearchLocation";
import { SearchOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
const ErrorMessage = styled.div`
  color: red;
`;

function Signup() {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me, location } = useSelector(
    (state) => state.user
  );
  const [email, onChangeEmail] = useInput("");
  const [nickname, onChangeNickname] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [password2, setPassword2] = useState("");
  const [password2Error, setPassword2Error] = useState(false);
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);
  const [place, SetPlace] = useState(false);

  useEffect(() => {
    if (signUpDone) {
      Router.push("/objectreceive");
    }
  }, [signUpDone]); // signup완료시 signUpDone값의 변화를 체크하여 메인페이지로

  useEffect(() => {
    if (signUpError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: signUpError,
      });
    }
  }, [signUpError]); // signUpError가 날경우 signUpError값의 변화를 체크하여 에러경고 발생

  const onChangePassword2 = useCallback(
    (e) => {
      setPassword2(e.target.value);
      setPassword2Error(e.target.value !== password);
    },
    [password]
  );

  const onChangeTerm = useCallback(
    (e) => {
      setTerm(e.target.checked);
      setTermError(false);
    },
    [term]
  );

  const onSubmit = useCallback(() => {
    if (password !== password2) return setPassword2Error(true);
    if (!term) return setTermError(true);
    console.log(email, nickname, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname, location },
    });
    Router.push("/objectreceive"); // 임시로 완료된거로 치고 메인으로 돌려보낸다
  }, [email, password, password2, term, location]);
  const placeHandle = () => {
    SetPlace(true);
  };
  return (
    <Layout>
      <Head>
        <title>회원가입 | 우리동네 렌탈대장</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            type="email"
            value={email}
            onChange={onChangeEmail}
            required
          />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input
            name="user-nick"
            value={nickname}
            onChange={onChangeNickname}
            required
          />
        </div>
        <div
          onClick={placeHandle}
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
        >
          {place ? (
            <SearchLocation />
          ) : (
            <div
              style={{
                width: "200px",
                height: "30px",
                border: "solid #d9d9d9",
                textAlign: "center",
              }}
            >
              지역 검색 <SearchOutlined />
            </div>
          )}
          {/*<Input name="user-location" value={location} required />*/}
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            type="password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password2"
            type="password"
            value={password2}
            onChange={onChangePassword2}
            required
          />
          {password2Error && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            우리동네 렌탈대장의 이용약관에 동의합니다.
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의 하셔야 합니다.</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            가입하기
          </Button>
        </div>
      </Form>
    </Layout>
  );
}

export default Signup;
