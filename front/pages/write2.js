import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout/AppLayout";
import { Button, Form, Input, Select } from "antd";
import "antd/dist/antd.css";
import {
  LOAD_POST_REQUEST,
  REMOVE_IMAGE,
  SEND_DUMMYPOST_REQUEST,
  UPDATE_BOARD,
  UPDATE_TAG,
  UPLOAD_IMAGES_REQUEST,
} from "../reducers/post";
import Router from "next/router";
import useInput from "../hooks/useInput";
import Layout from "../components/Layout";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const { TextArea } = Input;
const { Option } = Select;

function TalkSend({ postId, userId }) {
  const dispatch = useDispatch();
  const { me, location } = useSelector((state) => state.user);
  const { addPostDone } = useSelector((state) => state.post);
  const [title, onTitle, setTitle] = useInput("");
  const [content, onContent, setContent] = useInput("");
  const [toId, onToId, setToId] = useInput("");

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/objectreceive", undefined, { shallow: true });
    }
  }, [me && me.id]);

  useEffect(() => {
    if (addPostDone) {
      Router.push("/objectreceive", undefined, { shallow: true });
    }
  }, [addPostDone]);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    dispatch({
      type: UPDATE_TAG,
      data: "전체",
    });
    dispatch({
      type: UPDATE_BOARD,
      data: 9,
    });
  }, [location]);

  if (!me) {
    return "내 정보 로딩중...";
  }

  const onSubmit = useCallback(() => {
    if (!content || !content.trim()) {
      return alert("게시글을 작성하세요.");
    }
    const formData = new FormData();

    formData.append("content", content);
    formData.append("userid", me.id);
    formData.append("location", me.location);
    formData.append("nickname", me.nickname);
    formData.append("title", title);

    return dispatch({
      type: SEND_DUMMYPOST_REQUEST,
      data: formData,
    });
  }, [content]);

  const onCancel = useCallback(() => {
    Router.push("/", undefined, { shallow: true });
  }, []);

  return (
    <Layout>
      <div>
        <br />
      </div>
      <Form
        layout="horizontal"
        form={form}
        initialValues={{
          layout: "horizontal",
        }}
        onFinish={onSubmit}
      >
        <Form.Item>
          <Input.Group compact>
            <Input
              style={{ width: "69%" }}
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={onTitle}
            />{" "}
          </Input.Group>
        </Form.Item>

        <Form.Item>
          <TextArea
            placeholder="내용을 입력해주세요"
            autoSize={{ minRows: 7, maxRows: 7 }}
            value={content}
            onChange={onContent}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit">
            등록
          </Button>{" "}
          <Button type="primary" onClick={onCancel}>
            취소
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default TalkSend;
