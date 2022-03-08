import React, {useCallback, useEffect, useState} from 'react';

import {Tag} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {LOAD_RENTAL_POST_REQUEST, LOAD_WRITE_POST_REQUEST} from "../reducers/post";

function WriteTags({id}) {

  const { CheckableTag } = Tag;

  const dispatch = useDispatch();

  const tagsData = ["렌탈","게시글"];

  const [selectedTags,setSelectedTags] =useState([]);

  const handleChange = useCallback((tag, checked) => {
    const nextSelectedTags = checked ? [ tag,...selectedTags,] : selectedTags.filter(t => t !== tag);
    setSelectedTags([...nextSelectedTags]);
    if(nextSelectedTags[0] == tagsData[0])
    {
      dispatch({
        type:LOAD_RENTAL_POST_REQUEST,
        data:id, // 현재 열람중인 유저의 아이디
      })
    }
    else{
      dispatch({
        type:LOAD_WRITE_POST_REQUEST,
        data:id, // 현재 열람중인 유저의 아이디
      })
    }
    console.log('You are interested in: ', nextSelectedTags);
    console.log('You are interested in: ', nextSelectedTags[0]);
    },[]);

  useEffect(()=>{
    setSelectedTags(['전체']);
  },[]);

  return (
    <>
      {tagsData.map(tag => (
        <CheckableTag
          key={tag}
          checked={selectedTags.indexOf(tag) > -1}
          onChange={checked => handleChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      ))}
    </>
  );
}

export default WriteTags;
