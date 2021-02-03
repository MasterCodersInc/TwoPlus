import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const DiscussPost = (props) => {
  const { postId } = useParams();

  useEffect(() => {
    function fetchPostRef() {}
  });

  return (
    <div>
      <div>{postId}</div>
      <div>{props.post.title}</div>
    </div>
  );
};

export default DiscussPost;
