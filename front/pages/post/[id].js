import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import AppLayout from '../../components/AppLayout/AppLayout';

function PostPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // [tag].js 파일 명의 [] 부분이 들어간다
  const { mainPosts, hasMorePost, loadPostLoading , local } = useSelector((state) => state.post);
  const { userInfo, me } = useSelector((state) => state.user);

  return (
    <AppLayout>
      {id}
    </AppLayout>
  );
}

export default PostPage;
