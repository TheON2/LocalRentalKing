import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import AppLayout from '../../components/AppLayout/AppLayout';

function SearchResult() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { searchInput } = router.query; // [tag].js 파일 명의 [] 부분이 들어간다
  const { mainPosts, hasMorePost, loadPostLoading , local } = useSelector((state) => state.post);
  const { userInfo, me } = useSelector((state) => state.user);

  // useEffect(()=>{
  //   dispatch({ // 검색어를 제목에서 포함하며, 지역이 일치하는 게시물들을 10개씩요청
  //     type:LOAD_SEARCH_POSTS_REQUEST,
  //     data:searchInput,
  //     local:local,
  //   });
  // },[searchInput]);

  // useEffect(() => {
  //   const onScroll = () => {
  //     if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
  //       if (hasMorePost && !loadPostLoading) {
  //         dispatch({
  //           type: LOAD_SEARCH_POSTS_REQUEST, // 검색어를 제목에서 포함하며, 지역이 일치하는 게시물들을 10개씩요청
  //           lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
  //           data:searchInput,
  //           local:local,
  //         });
  //       }
  //     }
  //   };
  //   window.addEventListener('scroll', onScroll);
  //   return () => {
  //     window.removeEventListener('scroll', onScroll);
  //   };
  // }, [mainPosts.length, hasMorePost, searchInput, loadPostLoading]);

  return (
    <AppLayout>
      {searchInput}
    </AppLayout>
  );
}

export default SearchResult;
