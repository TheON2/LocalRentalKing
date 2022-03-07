import {
  Carousel,
  Button,
  Card,
  Space,
  Comment,
  Avatar,
  Form,
  List,
  Input,
  Menu,
} from 'antd';
import 'antd/dist/antd.css';

import React, { useState } from 'react';
import moment from 'moment';
import { MailOutlined } from '@ant-design/icons';

const contentStyle = {
  height: '270px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#000',
};

const { TextArea } = Input;
const { SubMenu } = Menu;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    // header={`${comments.length}개의 댓글`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        댓글달기
      </Button>
    </Form.Item>
  </>
);

const PostPage = () => {
  const handleClick = (e) => {
    console.log('click ', e);
  };
  function onChange(a) {
    console.log(a);
  }
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) {
      return;
    }
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: '신동혁', //회원 아이디(닉네임)
          avatar: 'https://joeschmoe.io/api/v1/random', //프로필 사진이 있다면 프로필 사진 경로
          content: <p>{value}</p>,
          datetime: moment().fromNow(),
          // actions: [<span key="comment-nested-reply-to"></span>],
        },
      ]);
    }, 500);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Carousel afterChange={onChange}>
        <div>
          <h3 style={contentStyle}>0</h3>
        </div>
        <div>
          <h3 style={contentStyle}>1</h3>
        </div>
        <div>
          <h3 style={contentStyle}>2</h3>
        </div>
        <div>
          <h3 style={contentStyle}>3</h3>
        </div>
      </Carousel>
      <div style={{ display: 'flex' }}>
        <Space
          direction="vertical"
          style={{ width: '50%', maxHeight: '300px' }}
        >
          <Card title="제목">
            <p>작성자: 000 &nbsp; 카테고리: 000 &nbsp; 비용: 000</p>

            <p>
              글내용~~~~~~~~~~~~~~~~~~~~~~~~~~~~~글내용~~~~~~~~~~~~~~~~~~~~~~~~~~~~~글내용~~~~~~~~~~~~~~~~~~~~~~~~~~~~~글내용~~~~~~~~~~~~~~~~~~~~~~~~~~~~~글내용~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </p>
          </Card>
        </Space>

        <Menu
          onClick={handleClick}
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <SubMenu
            key="sub1"
            icon={<MailOutlined />}
            style={{ width: '100%' }}
            title={`${comments.length}개의 댓글`}
          >
            <Space
              direction="vertical"
              style={{
                width: '50%',
                maxHeight: '300px',
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
              }}
            >
              <Card
                title={
                  comments.length > 0 && <CommentList comments={comments} />
                } //댓글 갯수
              >
                <Comment
                  avatar={
                    <Avatar
                      src="https://joeschmoe.io/api/v1/random"
                      alt="Han Solo"
                    /> //프로필 이미지
                  }
                  content={
                    <Editor
                      onChange={handleChange}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                      value={value}
                    />
                  }
                />
              </Card>
            </Space>
          </SubMenu>
        </Menu>
      </div>

      <div style={{ textAlign: 'center', marginTop: '150px' }}>
        <Button type="primary" key="edit">
          수정
        </Button>
        <span> </span>
        <Button type="primary" danger key="delete">
          삭제
        </Button>
      </div>
    </>
  );
};

export default PostPage;
