import React, {useCallback, useEffect, useState} from 'react';
import Head from 'next/head';
import {useDispatch, useSelector} from 'react-redux';
import {useInView} from "react-intersection-observer";

import AppLayout from '../components/AppLayout/AppLayout';
// import './index.css';
import {Button, Form, Input, Modal, Select, Upload} from "antd";
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {PlusOutlined} from "@ant-design/icons";
import {SEND_DUMMYPOST_REQUEST} from "../reducers/post";
import Router from "next/router";
import useInput from "../hooks/useInput";

const {TextArea} = Input;

const {Option} = Select;
const provinceData = [
  '물건빌려줘',
  '물건빌려줄게',
  '힘을빌려줘',
  '힘을빌려줄게',
  '같이하자',
  '동네놀이터',
];
const cityData = {
  물건빌려줘: [
    '공구',
    '의류',
    '전자기기',
    '서적',
    '게임/취미',
    '차량',
    '스포츠/래저',
    '뷰티/미용',
    '반려동물',
    '기타',
  ],
  물건빌려줄게: [
    '공구',
    '의류',
    '전자기기',
    '서적',
    '게임/취미',
    '차량',
    '스포츠/래저',
    '뷰티/미용',
    '반려동물',
    '기타',
  ],
  힘을빌려줘: ['미술', '구충', '설치', '코칭', '촬영', '일손', '기타'],
  힘을빌려줄게: ['미술', '구충', '설치', '코칭', '촬영', '일손', '기타'],
  같이하자: ['1+1', '배달', '공동구매', '기타'],
  동네놀이터: ['질문', '자유'],
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function Write() {
  const { me } = useSelector((state)=>state.user);
  const [cities, setCities] = useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  if (!me) {
    return '내 정보 로딩중...';
  }

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleChange = ({fileList}) => setFileList(fileList);

  const [form] = Form.useForm();

  const handleProvinceChange = (value) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = (value) => {
    setSecondCity(value);
  };

  // const onSubmit = useCallback(() => {
  //   if (!text || !text.trim()) {
  //     return alert('게시글을 작성하세요.');
  //   }
  //   const formData = new FormData();
  //   imagePaths.forEach((i) => {
  //     formData.append('image', i);
  //   });
  //   formData.append('content', text);
  //   return dispatch({
  //     type: ADD_POST_REQUEST,
  //     data: formData,
  //   });
  // }, [text, imagePaths]);

  const [text, onChangeText, setText] = useInput('');

  const sendDummyPost1 = useCallback(() => { // 이걸 기반으로 다양한 유형의 글쓰기를 테스트 할 예정
    const formData = new FormData();
    formData.append('userid',2);
    formData.append('location',"광주");
    formData.append('nickname',"TheON2");
    formData.append('boardNum',3);
    formData.append('category',"공구");
    formData.append('title',"테스트 글 1번의 제목");
    formData.append('content',"제발 무사히 글이 올라가게 해주세요!!!");
    formData.append('price',4000);
    //임의로 폼데이터와 매개변수를 조정해서 각 기능들을 테스트 해주세요.
    // 라이트 폼에서 submit 버튼을 누르면 이 메서드가 실행됩니다.
    dispatch({
      type:SEND_DUMMYPOST_REQUEST,
      data:formData,
    });
  },[]);

  const Test = useCallback(() => { // 이걸 기반으로 다양한 유형의 글쓰기를 테스트 할 예정
   console.log(cities);
   console.log(secondCity);
  },[]);


  const uploadButton = (
    <div>
      <PlusOutlined/>
      <div style={{marginTop: 8}}>사진</div>
    </div>
  );

  return (
    <AppLayout>
      <Form
        layout="horizontal"
        form={form}
        initialValues={{
          layout: 'horizontal',
        }}
        onFinish={Test}
      >
        <Form.Item>
          <Select
            defaultValue={provinceData[0]}
            style={{width: 120}}
            onChange={handleProvinceChange}
          >
            {provinceData.map((province) => (
              <Option key={province}>{province}</Option>
            ))}
          </Select>
          <Select
            style={{width: 120}}
            value={secondCity}
            onChange={onSecondCityChange}
          >
            {cities.map((city) => (
              <Option key={city}>{city}</Option>
            ))}
          </Select>
        </Form.Item>

        <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="유저아이디"/>
        <Input.TextArea value={text2} onChange={onChangeText2} maxLength={140} placeholder="지역"/>
        <Input.TextArea value={text3} onChange={onChangeText3} maxLength={140} placeholder="닉네임"/>
        <Input.TextArea value={text4} onChange={onChangeText4} maxLength={140} placeholder="보드넘버"/>
        <Input.TextArea value={text5} onChange={onChangeText5} maxLength={140} placeholder="카테고리"/>
        <Input.TextArea value={text6} onChange={onChangeText6} maxLength={140} placeholder="제목"/>
        <Input.TextArea value={text7} onChange={onChangeText7} maxLength={140} placeholder="내용"/>
        <Input.TextArea value={text8} onChange={onChangeText8} maxLength={140} placeholder="렌탈비"/>

        <Form.Item style={{textAlign: 'center'}}>
          <Button type="primary" htmlType="submit">
            등록
          </Button>{' '}
          <Button type="primary">취소</Button>
        </Form.Item>
      </Form>
    </AppLayout>
  );
};

export default Write;
