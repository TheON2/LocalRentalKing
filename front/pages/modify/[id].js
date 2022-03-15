import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select } from "antd";
import "antd/dist/antd.css";
import {
  MODIFY_POST_REQUEST,
  REMOVE_IMAGE,
  UPLOAD_IMAGES_REQUEST,
} from "../../reducers/post";
import Router, { useRouter } from "next/router";
import useInput from "../../hooks/useInput";
import Layout from "../../components/Layout";
import { LOAD_SPOST_REQUEST } from "../../reducers/post";
import styled from "styled-components";
import a1 from "../../components/광고1.jpeg";
import a2 from "../../components/광고2.jpg";
import a3 from "../../components/광고3.jpg";
import a4 from "../../components/광고4.jpeg";
import a5 from "../../components/광고5.jpg";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const PostCarDiv2 = styled.div`
  width: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  justify-content: center;
`;
const AdvertisementDiv = styled.div`
  width: 100%;
  height: 297px;
  // background:blue;
  position: relative;
`;

const { TextArea } = Input;
const { Option } = Select;

function Modify() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // [tag].js 파일 명의 [] 부분이 들어간다
  const { me } = useSelector((state) => state.user);
  const {
    modifyPostDone,
    singlePost,
    object_TagsData,
    talent_TagsData,
    cooperate_tagsData,
    play_tagsData,
    imagePaths,
    addPostDone,
  } = useSelector((state) => state.post);
  const [title, onTitle, setTitle] = useInput("");
  const [content, onContent, setContent] = useInput("");
  const [price, onPrice, setPrice] = useInput(0);
  const [originalPrice, onOriginalPrice, setOriginalPrice] = useInput(0);
  const [sharedPrice, onSharedPrice, setSharedPrice] = useInput(0);

  const advImg = [
    {
      src: a1,
    },
    {
      src: a2,
    },
    {
      src: a3,
    },
    {
      src: a4,
    },
    {
      src: a5,
    },
  ];

  const [i, Seti] = useState(0);
  const [imgSrc, SetImgSrc] = useState(a1);
  const RchangeImg = () => {
    if (i < 5) {
      Seti(i + 1);
      SetImgSrc(advImg[i].src);
    } else if (i === 5) {
      Seti(0);
    }
  };
  const LchangImg = () => {
    if (i > 0) {
      Seti(i - 1);
      SetImgSrc(advImg[i - 1].src);
      console.log(imgSrc);
    }
  };

  const idAndBoardNum = id.split("*");
  const postId = idAndBoardNum[0];
  const postBoardNum = idAndBoardNum[1];
  const [postId2, setPostId] = useState(postId);
  const [postBoardNum2, setPostBoardNum] = useState(postBoardNum);

  const provinceData = [
    "물건빌려줘",
    "물건빌려줄게",
    "힘을빌려줘",
    "힘을빌려줄게",
    "같이하자",
    "동네놀이터",
  ];
  const tags1 = object_TagsData.filter((e, i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags2 = object_TagsData.filter((e, i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags3 = talent_TagsData.filter((e, i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags4 = talent_TagsData.filter((e, i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags5 = cooperate_tagsData.filter((e, i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags6 = play_tagsData.filter((e, i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const imageInput = useRef();

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/objectreceive", undefined, { shallow: true });
    }
  }, [me && me.id]);

  useEffect(() => {
    if (modifyPostDone) {
      Router.push("/objectreceive", undefined, { shallow: true });
    }
  }, [modifyPostDone]);

  // useEffect(()=>{
  //   dispatch({
  //     type:LOAD_SPOST_REQUEST,
  //     postId:postId,
  //     postBoardNum:postBoardNum,
  //   });
  // },[postId,postBoardNum]);

  useEffect(() => {
    setPrice(singlePost.price);
    setOriginalPrice(singlePost.originalPrice);
    setSharedPrice(singlePost.sharedPrice);
    setTitle(singlePost.title);
    setContent(singlePost.content);
  }, []);

  if (!me) {
    return "내 정보 로딩중...";
  }

  const [form] = Form.useForm();

  const [category, setCategory] = useState(tags1[0]);
  const onCategory = useCallback((value) => {
    setCategory(value);
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log("images", e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  const onSubmit = useCallback(() => {
    if (!content || !content.trim()) {
      return alert("게시글을 작성하세요.");
    }

    if (!price) setPrice(0);
    if (!originalPrice) setOriginalPrice(0);
    if (!sharedPrice) setSharedPrice(0);

    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append("image", i);
    });
    formData.append("content", content);
    formData.append("userid", me.id);
    formData.append("id", singlePost.id);
    formData.append("location", me.location);
    formData.append("nickname", me.nickname);
    formData.append("title", title);
    formData.append("originalPrice", originalPrice);
    formData.append("sharedPrice", sharedPrice);
    formData.append("price", price);
    formData.append("boardNum", singlePost.boardNum);

    return dispatch({
      type: MODIFY_POST_REQUEST,
      data: formData,
    });
  }, [content, imagePaths, title, price, originalPrice, sharedPrice]);

  const onCancel = useCallback(() => {
    Router.push("/objectreceive", undefined, { shallow: true });
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
            {singlePost.boardNum === 1 && (
              <Input
                style={{ width: "30%" }}
                placeholder="렌탈비를 입력해주세요."
                value={price}
                onChange={onPrice}
              />
            )}
            {singlePost.boardNum === 2 && (
              <Input
                style={{ width: "30%" }}
                placeholder="렌탈비를 입력해주세요."
                value={price}
                onChange={onPrice}
              />
            )}
            {singlePost.boardNum === 3 && (
              <Input
                style={{ width: "30%" }}
                placeholder="렌탈비를 입력해주세요."
                value={price}
                onChange={onPrice}
              />
            )}
            {singlePost.boardNum === 4 && (
              <Input
                style={{ width: "30%" }}
                placeholder="렌탈비를 입력해주세요."
                value={price}
                onChange={onPrice}
              />
            )}
            {singlePost.boardNum === 5 && singlePost.category == tags5[0] && (
              <Input.Group>
                <Input
                  style={{ width: "30%" }}
                  placeholder="물품금액을 입력해주세요."
                  value={originalPrice}
                  onChange={onOriginalPrice}
                />
                <Input
                  style={{ width: "30%" }}
                  placeholder="개인부담액을 입력해주세요."
                  value={sharedPrice}
                  onChange={onSharedPrice}
                />
              </Input.Group>
            )}
            {singlePost.boardNum === 5 && singlePost.category == tags5[1] && (
              <Input.Group>
                <Input
                  style={{ width: "30%" }}
                  placeholder="배달비를 입력해주세요."
                  value={originalPrice}
                  onChange={onOriginalPrice}
                />
                <Input
                  style={{ width: "30%" }}
                  placeholder="개인부담액을 입력해주세요."
                  value={sharedPrice}
                  onChange={onSharedPrice}
                />
              </Input.Group>
            )}
            {singlePost.boardNum === 5 && singlePost.category == tags5[2] && (
              <Input.Group>
                <Input
                  style={{ width: "30%" }}
                  placeholder="정상가를 입력해주세요."
                  value={originalPrice}
                  onChange={onOriginalPrice}
                />
                <Input
                  style={{ width: "30%" }}
                  placeholder="공구가를 입력해주세요."
                  value={sharedPrice}
                  onChange={onSharedPrice}
                />
              </Input.Group>
            )}
            {singlePost.boardNum === 5 && singlePost.category == tags5[3] && (
              <Input
                style={{ width: "30%" }}
                placeholder="렌탈비를 입력해주세요."
                value={originalPrice}
                onChange={onOriginalPrice}
              />
            )}
          </Input.Group>
        </Form.Item>
        <Form.Item>
          <div>
            <input
              type="file"
              name="image"
              multiple
              hidden
              ref={imageInput}
              onChange={onChangeImages}
            />
            <Button onClick={onClickImageUpload}>이미지 업로드</Button>
          </div>
          <div>
            {imagePaths.map((v, i) => (
              <div key={v} style={{ display: "inline-block" }}>
                <img
                  src={`http://localhost:3065/${v}`}
                  style={{ width: "200px" }}
                  alt={v}
                />
                {/* 프론트와 백의 도메인이 다르기 때문에 도메인 교정을 해주어야 백의 이미지를 성공적으로 들고와 렌더링 할 수 있다. */}
                <div>
                  <Button onClick={onRemoveImage(i)}>제거</Button>
                </div>
              </div>
            ))}
          </div>
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

export default Modify;
