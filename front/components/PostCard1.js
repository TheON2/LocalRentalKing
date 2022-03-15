import React, { useCallback } from "react";
import "antd/dist/antd.css";
import { Card } from "antd";
import Router from "next/router";
import Link from "next/link";
import wan from "./wan.png";
import ing from "./ing.png";

const gridStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  margin: "10px",
};

const tradeDoneGridStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  margin: "10px",
  background: "grey",
  opacity: "40%",
  backgroundImage: `url(${wan})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const tradeIng = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  margin: "10px",
  // background: "blue",
  //opacity: "80%",
  backgroundImage: `url(${ing})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const PostCard1 = ({ post }) => {
  const onPage = useCallback(() => {
    Router.push(`/post/${post.id}*${post.boardNum}`);
  }, [post.id]);

  return (
    <div onClick={onPage}>
      <Card.Grid
        style={
          post.status === 2
            ? tradeDoneGridStyle
            : post.status === 1
            ? tradeIng
            : gridStyle
        }
      >
        <div>
          <p style={{ fontSize: "1.05rem" }}>{post.title}</p>

          {post.boardNum === 1 ? <p>렌탈요금(￦): {post.price}</p> : null}
          {post.boardNum === 2 ? <p>렌탈요금(￦): {post.price}</p> : null}
          {post.boardNum === 3 ? <p>렌탈요금(￦): {post.price}</p> : null}
          {post.boardNum === 4 ? <p>렌탈요금(￦): {post.price}</p> : null}

          {post.boardNum === 5 && post.category === "1+1" ? (
            <p>
              개인부담액(￦): {post.sharedPrice} / 물품금액(￦):{" "}
              {post.originalPrice}
            </p>
          ) : null}

          {post.boardNum === 5 && post.category === "배달" ? (
            <p>
              개인부담액(￦): {post.sharedPrice} / 배달비(￦):{" "}
              {post.originalPrice}
            </p>
          ) : null}

          {post.boardNum === 5 && post.category === "공동구매" ? (
            <p>
              공구가(￦): {post.sharedPrice} / 정상가(￦): {post.originalPrice}
            </p>
          ) : null}

          {post.boardNum === 5 && post.category === "기타" ? (
            <p>비용(￦): {post.originalPrice}</p>
          ) : null}
          <p className="tradeStatus">
            {(post.boardNum === 1 ||
              post.boardNum === 2 ||
              post.boardNum === 3 ||
              post.boardNum === 4) &&
            post.status === 0 ? (
              <p>거래 전</p>
            ) : null}
          </p>
          <p className="tradeStatus">
            {(post.boardNum === 1 ||
              post.boardNum === 2 ||
              post.boardNum === 3 ||
              post.boardNum === 4) &&
            post.status === 1 ? (
              <p>거래 중</p>
            ) : null}
          </p>
          <p className="tradeStatus">
            {(post.boardNum === 1 ||
              post.boardNum === 2 ||
              post.boardNum === 3 ||
              post.boardNum === 4) &&
            post.status === 2 ? (
              <p>거래 완료</p>
            ) : null}
          </p>
          <p className="tradeStatus">
            {post.boardNum === 5 && post.status === 0 ? <p>모집 전</p> : null}
          </p>
          <p className="tradeStatus">
            {post.boardNum === 5 && post.status === 1 ? <p>모집 중</p> : null}
          </p>
          <p className="tradeStatus">
            {post.boardNum === 5 && post.status === 2 ? <p>모집 완료</p> : null}
          </p>
        </div>
        <div>
          <p>작성자: {post.user_nickname}</p>
          <p>{post.createAt || 0}분전</p>
        </div>
      </Card.Grid>
    </div>
  );
};

export default PostCard1;
