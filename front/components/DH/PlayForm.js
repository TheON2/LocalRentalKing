import { Button, Form, Input } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

function PlayForm() {
  // const { imagePaths } = useSelector((state) => state.post);
  const [text, setText] = useState('');
  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);
  const imageInput = useRef();
  const onClickimageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);
  const onSubmit = useCallback(() => {}, []);
  return (
    <Form
      style={{ margin: '10px' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={500}
        placeholder="자유롭게 소통해요"
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onClickimageUpload}>이미지 업로드</Button>

        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
          작성
        </Button>
      </div>
    </Form>
  );
}

export default PlayForm;
