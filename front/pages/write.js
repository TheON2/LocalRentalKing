import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AppLayout from '../components/AppLayout/AppLayout';
import {Button, Form, Input, Select} from "antd";
import 'antd/dist/antd.css';
import {REMOVE_IMAGE, SEND_DUMMYPOST_REQUEST, UPLOAD_IMAGES_REQUEST} from "../reducers/post";
import Router from "next/router";
import useInput from "../hooks/useInput";
import Layout from "../components/Layout";

const {TextArea} = Input;
const {Option} = Select;

function Write() {
  const dispatch = useDispatch();
  const {me} = useSelector((state) => state.user);
  const {object_TagsData , talent_TagsData , cooperate_tagsData , play_tagsData , imagePaths, addPostDone} = useSelector((state) => state.post);
  const [title, onTitle, setTitle] = useInput('');
  const [content, onContent, setContent] = useInput('');
  const [price, onPrice, setPrice] = useInput(0);
  const [originalPrice, onOriginalPrice, setOriginalPrice] = useInput(0);
  const [sharedPrice, onSharedPrice, setSharedPrice] = useInput(0);

  const provinceData = ['물건빌려줘', '물건빌려줄게', '힘을빌려줘', '힘을빌려줄게', '같이하자', '동네놀이터',];
  const tags1 = object_TagsData.filter((e,i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags2 = object_TagsData.filter((e,i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags3 = talent_TagsData.filter((e,i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags4 = talent_TagsData.filter((e,i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags5 = cooperate_tagsData.filter((e,i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const tags6 = play_tagsData.filter((e,i) => i > 0); // 전체 태그를 제외한 나머지 태그들을 불러옴
  const imageInput = useRef();

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (addPostDone) {
      Router.push('/');
    }
  }, [addPostDone]);

  useEffect(() => {
    setPrice(null);
    setOriginalPrice(null);
    setSharedPrice(null);
  }, []);

  if (!me) {
    return '내 정보 로딩중...';
  }


    const [form] = Form.useForm();

    const [board, setBoard] = useState(provinceData[0]);
    const onBoard = useCallback((value) => {
      setBoard(value);
    }, []);

    const [category, setCategory] = useState(tags1[0]);
    const onCategory = useCallback((value) => {
      setCategory(value);
    }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
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
      return alert('게시글을 작성하세요.');
    }

    if(!price)setPrice(0);
    if(!originalPrice)setOriginalPrice(0);
    if(!sharedPrice)setSharedPrice(0);

    const formData = new FormData();
    imagePaths.forEach((i) => {
      formData.append('image', i);
    });
    formData.append('content', content);
    formData.append('userid', me.id);
    formData.append('location', me.location);
    formData.append('nickname', me.nickname);
    formData.append('category', category);
    formData.append('title', title);
    formData.append('originalPrice', originalPrice);
    formData.append('sharedPrice', sharedPrice);
    formData.append('price', price);

    if(board == provinceData[0])formData.append('boardNum', 1);
    else if(board == provinceData[1])formData.append('boardNum', 2);
    else if(board == provinceData[2])formData.append('boardNum', 3);
    else if(board == provinceData[3])formData.append('boardNum', 4);
    else if(board == provinceData[4])formData.append('boardNum', 5);
    else if(board == provinceData[5])formData.append('boardNum', 6);

    return dispatch({
      type: SEND_DUMMYPOST_REQUEST,
      data: formData,
    });
  }, [content, imagePaths]);

  const onCancel = useCallback(() => {
    Router.push('/');
  }, []);

  return (
    <Layout>
      <div><br/></div>
      <Form
        layout="horizontal"
        form={form}
        initialValues={{
          layout: 'horizontal',
        }}
        onFinish={onSubmit}
      >

        <Form.Item>
          <Input.Group compact >
            <Input style={{width: '69%'}} placeholder="제목을 입력해주세요." value={title} onChange={onTitle}/>{' '}
            {board === provinceData[0] &&
            <Input style={{width: '30%'}} placeholder="렌탈비를 입력해주세요." value={price} onChange={onPrice}/>}
            {board === provinceData[1] &&
            <Input style={{width: '30%'}} placeholder="렌탈비를 입력해주세요." value={price} onChange={onPrice}/>}
            {board === provinceData[2] &&
            <Input style={{width: '30%'}} placeholder="렌탈비를 입력해주세요." value={price} onChange={onPrice}/>}
            {board === provinceData[3] &&
            <Input style={{width: '30%'}} placeholder="렌탈비를 입력해주세요." value={price} onChange={onPrice}/>}

            {board === provinceData[4] && category == tags5[0] &&
            <Input.Group>
              <Input
                style={{width: '30%'}}
                placeholder="물품금액을 입력해주세요."
                value={originalPrice} onChange={onOriginalPrice}
              />
              <Input
              style={{width: '30%'}}
              placeholder="개인부담액을 입력해주세요."
              value={sharedPrice} onChange={onSharedPrice}
              />
            </Input.Group>
            }

            {board === provinceData[4] && category == tags5[1] &&
            <Input.Group>
              <Input
                style={{width: '30%'}}
                placeholder="배달비를 입력해주세요."
                value={originalPrice} onChange={onOriginalPrice}
              />
              <Input
                style={{width: '30%'}}
                placeholder="개인부담액을 입력해주세요."
                value={sharedPrice} onChange={onSharedPrice}
              />
            </Input.Group>
            }

            {board === provinceData[4] && category == tags5[2] &&
            <Input.Group>
              <Input
                style={{width: '30%'}}
                placeholder="정상가를 입력해주세요."
                value={originalPrice} onChange={onOriginalPrice}
              />
              <Input
                style={{width: '30%'}}
                placeholder="공구가를 입력해주세요."
                value={sharedPrice} onChange={onSharedPrice}
              />
            </Input.Group>
            }


            {board === provinceData[4] && category == tags5[3] &&
            <Input
              style={{width: '30%'}}
              placeholder="렌탈비를 입력해주세요."
              value={originalPrice} onChange={onOriginalPrice}
            />
            }

          </Input.Group>
        </Form.Item>

        <Form.Item>
          <Select
            defaultValue={provinceData}
            style={{width: 120}}
            onChange={onBoard}
          >
            {provinceData.map((province) => (
              <Option key={province}>{province}</Option>
            ))}
          </Select>
          {board === provinceData[0] &&
          <Select
            style={{width: 120}}
            defaultValue={tags1[0]}
            onChange={onCategory}
          >
            {tags1.map((tag) => (
              <Option value={tag}>{tag}</Option>
            ))}
          </Select>
          }
          {board === provinceData[1] &&
          <Select
            style={{width: 120}}
            defaultValue={tags2[0]}
            onChange={onCategory}
          >
            {tags2.map((city) => (
              <Option value={city}>{city}</Option>
            ))}
          </Select>
          }
          {board === provinceData[2] &&
          <Select
            style={{width: 120}}
            defaultValue={tags3[0]}
            onChange={onCategory}
          >

            {tags3.map((city) => (
              <Option value={city}>{city}</Option>
            ))}
          </Select>
          }
          {board === provinceData[3] &&
          <Select
            style={{width: 120}}
            defaultValue={tags4[0]}
            onChange={onCategory}
          >

            {tags4.map((city) => (
              <Option value={city}>{city}</Option>
            ))}
          </Select>
          }
          {board === provinceData[4] &&
          <Select
            style={{width: 120}}
            defaultValue={null}
            onChange={onCategory}
          >
            {tags5.map((city) => (
              <Option value={city}>{city}</Option>
            ))}
          </Select>
          }
          {board === provinceData[5] &&
          <Select
            style={{width: 120}}
            defaultValue={tags6[0]}
            onChange={onCategory}
          >
            {tags6.map((city) => (
              <Option value={city}>{city}</Option>
            ))}
          </Select>
          }
        </Form.Item>
        <Form.Item>
          <div>
            <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
            <Button onClick={onClickImageUpload}>이미지 업로드</Button>
          </div>
          <div>
            {imagePaths.map((v, i) => (
              <div key={v} style={{ display: 'inline-block' }}>
                <img src={`http://localhost:3065/${v}`} style={{ width: '200px' }} alt={v} />
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
            autoSize={{minRows: 7, maxRows: 7}}
            value={content}
            onChange={onContent}
          />
        </Form.Item>

        <Form.Item style={{textAlign: 'center'}}>
          <Button type="primary" htmlType="submit">
            등록
          </Button>{' '}
          <Button type="primary" onClick={onCancel}>취소</Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Write;
