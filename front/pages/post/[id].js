import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Router, {useRouter} from 'next/router';
import AppLayout from '../../components/AppLayout/AppLayout';
import {LOAD_SPOST_REQUEST} from "../../reducers/post";
import {Avatar, Button, Card, Form} from "antd";
import PostImages from "../../components/PostImages";
import Link from 'next/link';
import Layout from "../../components/Layout";
import Reply from "../../components/DH/Reply";
import moment from "moment";

function PostPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // [tag].js 파일 명의 [] 부분이 들어간다
  const { singlePost,mainPosts, hasMorePost, loadPostLoading , location } = useSelector((state) => state.post);
  const { userInfo, me } = useSelector((state) => state.user);

  const idAndBoardNum = id.split('*');
  const postId = idAndBoardNum[0];
  const postBoardNum = idAndBoardNum[1];
  const [postId2,setPostId] = useState(postId);
  const [postBoardNum2,setPostBoardNum] = useState(postBoardNum);

  const [form] = Form.useForm();

  useEffect(()=>{
    dispatch({
      type:LOAD_SPOST_REQUEST,
      postId:postId,
      postBoardNum:postBoardNum,
    });
  },[postId,postBoardNum]);

  useEffect(()=>{
    setTimeout(() => {
      if(singlePost === null)
      {
        setPostId((prev)=>prev-1);
        dispatch({
          type:LOAD_SPOST_REQUEST,
          postId:postId2,
          postBoardNum:postBoardNum,
        });
      }
    }, 500);
  },[postId2,postBoardNum2]);

  const prevPage = useCallback(() => {
    setPostId((prev)=>prev-1);
    dispatch({
      type:LOAD_SPOST_REQUEST,
      postId:postId2,
      postBoardNum:postBoardNum2,
    });
  }, [postId2,postBoardNum2]);

  const nextPage = useCallback(() => {
    setPostId((prev)=>prev+1);
    dispatch({
      type:LOAD_SPOST_REQUEST,
      postId:postId2,
      postBoardNum:postBoardNum2,
    });
  }, [postId2,postBoardNum2]);

  return (

    <Layout>
      {singlePost &&
      <Form
        layout="horizontal"
        form={form}
        initialValues={{
          layout: 'horizontal',
        }}>
        {singlePost.boardNum === 1  &&
          <div>
            {singlePost.ProdPostImages.length > 0 ?
              (<Card
                cover={<PostImages images={singlePost.ProdPostImages}/>}
                title={singlePost.title}
              >
                {singlePost.content}
              </Card>) :
              (
                <Card
                  title={singlePost.title}
                >
                  {singlePost.content}
                </Card>
              )
            }
            <Reply/>
          </div>
        }
        {singlePost.boardNum === 2  &&
        <div>
          {singlePost.ProdPostImages.length > 0 ?
            (<Card
              cover={<PostImages images={singlePost.ProdPostImages}/>}
              title={singlePost.title}
            >
              {singlePost.content}
            </Card>) :
            (
              <Card
                title={singlePost.title}
              >
                {singlePost.content}
              </Card>
            )
          }
          <Reply/>
        </div>
        }
        {singlePost.boardNum === 3  &&
        <div>
          {singlePost.PowerPostImages.length > 0 ?
            (<Card
              cover={<PostImages images={singlePost.PowerPostImages}/>}
              title={singlePost.title}
            >
              {singlePost.content}
            </Card>) :
            (
              <Card
                title={singlePost.title}
              >
                {singlePost.content}
              </Card>
            )
          }
        </div>
        }
        {singlePost.boardNum === 4  &&
        <div>
          {singlePost.PowerPostImages.length > 0 ?
            (<Card
              cover={<PostImages images={singlePost.PowerPostImages}/>}
              title={singlePost.title}
            >
              {singlePost.content}
            </Card>) :
            (
              <Card
                title={singlePost.title}
              >
                {singlePost.content}
              </Card>
            )
          }
        </div>
        }
        {singlePost.boardNum === 5  &&
        <div>
          {singlePost.TogetherPostImages.length > 0 ?
            (<Card
              cover={<PostImages images={singlePost.TogetherPostImages}/>}
              title={singlePost.title}
            >
              {singlePost.content}
            </Card>) :
            (
              <Card
                title={singlePost.title}
              >
                {singlePost.content}
              </Card>
            )
          }
        </div>
        }
        <div>
          <Button onClick={prevPage}>이전글</Button>
          <Button onClick={nextPage}>다음글</Button>
        </div>
      </Form>
      }
    </Layout>

  );
}

export default PostPage;
