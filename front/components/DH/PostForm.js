import React, { useState } from "react";
// import ReactDOM from 'react-dom';
import "antd/dist/antd.css";
// import './index.css';
import { Input, Select, Form, Button, Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const { Option } = Select;
const provinceData = [
  "물건빌려줘",
  "물건빌려줄게",
  "힘을빌려줘",
  "힘을빌려줄게",
  "같이하자",
  "동네놀이터",
];
const cityData = {
  물건빌려줘: [
    "공구",
    "의류",
    "전자기기",
    "서적",
    "게임/취미",
    "차량",
    "스포츠/래저",
    "뷰티/미용",
    "반려동물",
    "기타",
  ],
  물건빌려줄게: [
    "공구",
    "의류",
    "전자기기",
    "서적",
    "게임/취미",
    "차량",
    "스포츠/래저",
    "뷰티/미용",
    "반려동물",
    "기타",
  ],
  힘을빌려줘: ["미술", "구충", "설치", "코칭", "촬영", "일손", "기타"],
  힘을빌려줄게: ["미술", "구충", "설치", "코칭", "촬영", "일손", "기타"],
  같이하자: ["1+1", "배달", "공동구매", "기타"],
  동네놀이터: ["질문", "자유"],
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const PostForm = () => {
  const [cities, setCities] = useState(cityData[provinceData[0]]);
  const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  const [form] = Form.useForm();

  const handleProvinceChange = (value) => {
    setCities(cityData[value]);
    setSecondCity(cityData[value][0]);
  };

  const onSecondCityChange = (value) => {
    setSecondCity(value);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>사진</div>
    </div>
  );

  return (
    <Form
      layout="horizontal"
      form={form}
      initialValues={{
        layout: "horizontal",
      }}
    >
      <Form.Item>
        <Input.Group compact>
          <Input style={{ width: "69%" }} placeholder="제목을 입력해주세요." />{" "}
          <Input
            style={{ width: "30%" }}
            placeholder="렌탈비를 입력해주세요."
          />
        </Input.Group>
      </Form.Item>

      <Form.Item>
        <Select
          defaultValue={provinceData[0]}
          style={{ width: 120 }}
          onChange={handleProvinceChange}
        >
          {provinceData.map((province) => (
            <Option key={province}>{province}</Option>
          ))}
        </Select>
        <Select
          style={{ width: 120 }}
          value={secondCity}
          onChange={onSecondCityChange}
        >
          {cities.map((city) => (
            <Option key={city}>{city}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Form.Item>
      <Form.Item>
        <TextArea
          // value={value}
          // onChange={this.onChange}
          placeholder="내용을 입력해주세요"
          autoSize={{ minRows: 7, maxRows: 7 }}
        />
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit">
          등록
        </Button>{" "}
        <Button type="primary">취소</Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;
