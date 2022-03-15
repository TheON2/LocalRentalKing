import React, { useCallback } from "react";
import "antd/dist/antd.css";
import { Card } from "antd";
import Router from "next/router";
import Link from "next/link";

const gridStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  margin: "10px",
};

const TalkCard1 = ({ talk }) => {
  return (
    <div>
      <Card.Grid style={gridStyle}>
        <div>
          <p>{talk.send_userId}</p>
        </div>
        <div>
          <p>{talk.content}</p>
        </div>
        <div>
          <p>{talk.createAt || 0}분전</p>
        </div>
      </Card.Grid>
    </div>
  );
};

export default TalkCard1;
