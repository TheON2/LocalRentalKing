import React, { useState } from "react";
import "antd/dist/antd.css";
// import '../css/index.css';
import { Comment, Avatar, Form, Button, List, Input } from "antd";
import moment from "moment";
// import { useSelector } from 'react/redux';
import logo from "../../public/nouser.png";
// import useInput from '../../hooks/useInput';
import { useDispatch, useSelector } from "react-redux";
// import { ADD_COMMENT_REQUEST } from '../../reducers/post';
// import { post } from '../../../back/routes/post';
const { TextArea } = Input;
const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length}개의 답변`}
    itemLayout="horizontal"
    renderItem={(props) => <Comment {...props} />}
    style={{
      maxHeight: "250px",
      overflow: "auto",
      height: "50vh",
    }}
  />
);
// const onSubmitComment = useCallback(() => {
//   dispatch({
//     type: ADD_COMMENT_REQUEST,
//     data: { content: value, postId: props.postId, userId: me.id },
//   });
// }, [content, id]);
const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <Form>
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
        댓글
      </Button>
    </Form.Item>
  </Form>
);
function Reply() {
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (!value) {
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setValue("");
      setComments([
        ...comments,
        {
          author: me.nickname,
          avatar: logo,
          content: <p>{value}</p>,
          datetime: moment().fromNow(),
          // actions: [<span key="comment-nested-reply-to">답글</span>],
        },
      ]);
    }, 500);
  };
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <div o>
      <br></br>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        avatar={<Avatar src={logo} alt="logo" />}
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </div>
  );
}
export default Reply;
