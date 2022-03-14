import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import AppLayout from '../../components/AppLayout/AppLayout';
import Layout from "../../components/Layout";
import {LOAD_CHANGE_TAG_REQUEST, LOAD_SEARCH_POSTS_REQUEST, UPDATE_TAG} from "../../reducers/post";
import Tags from "../../components/Tags";
import {Button, Tag} from "antd";
import PostCard1 from "../../components/PostCard1";
import PostCard2 from "../../components/PostCard2";
import styled from "styled-components";

const PostCarDiv2 = styled.div`
  width: 100%;
  display: flex;
  // background:red;
  flex-wrap: wrap;
  // justify-content:center;
`;

function SearchResult() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {searchInput} = router.query; // [tag].js 파일 명의 [] 부분이 들어간다
  const {
    mainPosts, hasMorePost, loadPostLoading, boardNum, object_TagsData,
    talent_TagsData, cooperate_tagsData, play_tagsData
  } = useSelector((state) => state.post);
  const {userInfo, me, location} = useSelector((state) => state.user);

  const categoryAndsearch = searchInput.split('*');
  const select = categoryAndsearch[0];
  const searchword = categoryAndsearch[1];
  const [searchPosts, setSearchPosts] = useState([]);

  const [view, setView] = useState(true);

  const onSwitch = useCallback(() => {
    setView(!view);
  }, [view]);

  const {CheckableTag} = Tag;

  const [selectedTags, setSelectedTags] = useState(mainPosts);

  const handleChange = useCallback((tag, checked) => {
    const nextSelectedTags = checked ? [tag, ...selectedTags,] : selectedTags.filter(t => t !== tag);
    setSelectedTags([...nextSelectedTags]);

    console.log('You are interested in: ', nextSelectedTags);
    console.log('You are interested in: ', nextSelectedTags[0]);
  }, []);

  useEffect(() => {
    if (selectedTags[0] !== '전체') {
      setSearchPosts(mainPosts.filter((v) => v.category === selectedTags))
    }
  }, [selectedTags]);

  useEffect(() => {
    setSelectedTags(['전체']);
  }, []);


  useEffect(() => {
    console.log(location);
    console.log(select);
    console.log(searchword);
    console.log(boardNum);
    dispatch({ // 검색어를 제목에서 포함하며, 지역이 일치하는 게시물들을 10개씩요청
      type: LOAD_SEARCH_POSTS_REQUEST,
      location: location,
      select: select,
      searchword: searchword,
      boardNum: boardNum,
      // boardNum 게시판의 select 요소를 기준으로 searchword 와 관련된 local 지역의 데이터를 가져온다.
    });
  }, [location, select, searchword, boardNum]);

  // useEffect(() => {
  //   const onScroll = () => {
  //     if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
  //       if (hasMorePost && !loadPostLoading) {
  //         dispatch({ // 검색어를 제목에서 포함하며, 지역이 일치하는 게시물들을 10개씩요청
  //           type: LOAD_SEARCH_POSTS_REQUEST,
  //           location: location,
  //           select : select,
  //           search: search,
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
    <div>
      {boardNum === 1 &&
      <Layout>
        {view ? (
          <>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard1 key={post.id} post={post}/>)}
          </>
        ) : (
          <>
          <PostCarDiv2>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard2 key={post.id} post={post}/>)}
          </PostCarDiv2>
          </>
        )}
      </Layout>}
      {boardNum === 2 &&
      <Layout>
        {view ? (
          <>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard1 key={post.id} post={post}/>)}
          </>
        ) : (
          <>
          <PostCarDiv2>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard2 key={post.id} post={post}/>)}
          </PostCarDiv2>
          </>
        )}
      </Layout>}
      {boardNum === 3 &&
      <Layout>
        {view ? (
          <>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard1 key={post.id} post={post}/>)}
          </>
        ) : (
          <>
          <PostCarDiv2>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard2 key={post.id} post={post}/>)}
          </PostCarDiv2>
          </>
        )}
      </Layout>}
      {boardNum === 4 &&
      <Layout>
        {view ? (
          <>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard1 key={post.id} post={post}/>)}
          </>
        ) : (
          <>
          <PostCarDiv2>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard2 key={post.id} post={post}/>)}
          </PostCarDiv2>
          </>
        )}
      </Layout>}
      {boardNum === 5 &&
      <Layout>
        {view ? (
          <>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard1 key={post.id} post={post}/>)}
          </>
        ) : (
          <>
          <PostCarDiv2>
            <Button onClick={onSwitch}>전환스위치</Button>
            {mainPosts.map((post) => <PostCard2 key={post.id} post={post}/>)}
          </PostCarDiv2>
          </>
        )}
      </Layout>}
    </div>
  );
}

export default SearchResult;
