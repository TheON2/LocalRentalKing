import React, { useCallback, useEffect, useState } from "react";

import { Tag, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_SCHANGE_TAG_REQUEST,
  UPDATE_CHANGE_TAG_REQUEST,
  LOAD_POST_REQUEST,
  UPDATE_TAG,
  LOAD_SEARCH_POSTS_REQUEST,
} from "../reducers/post";

function Tags({ tagsData, boardNum, select, search }) {
  const { CheckableTag } = Tag;

  const dispatch = useDispatch();

  const { location } = useSelector((state) => state.user);

  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = useCallback(
    (tag, checked) => {
      const nextSelectedTags = checked
        ? [tag]
        : selectedTags.filter((t) => t !== tag);
      setSelectedTags([...nextSelectedTags]);

      dispatch({
        type: UPDATE_CHANGE_TAG_REQUEST,
        data: nextSelectedTags[0], // 현재 선택한 태그명
        boardNum: boardNum, // 현재 렌더링중인 게시판 고유번호
      });

      dispatch({
        type: UPDATE_TAG,
        data: nextSelectedTags[0], // 전역적으로 현재 선택한 태그를 공유한다.
      });
      console.log(search);
      dispatch({
        // 검색어를 제목에서 포함하며, 지역이 일치하는 게시물들을 10개씩요청
        type: LOAD_SCHANGE_TAG_REQUEST,
        location: location,
        select: select,
        searchword: search,
        boardNum: boardNum,
        tag: nextSelectedTags[0],
        // boardNum 게시판의 select 요소를 기준으로 searchword 와 관련된 local 지역의 데이터를 가져온다.
      });

      console.log("You are interested in: ", nextSelectedTags);
      console.log("You are interested in: ", nextSelectedTags[0]);
    },
    [selectedTags]
  );

  useEffect(() => {
    setSelectedTags(["전체"]);
  }, []);

  return (
    <>
      {tagsData.map((tag) => (
        <CheckableTag
          key={tag}
          checked={selectedTags.indexOf(tag) > -1}
          onChange={(checked) => handleChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      ))}
    </>
  );
}

export default Tags;
