import React, { useEffect, useState } from "react";
import EditorUID from "./EditorUID";
import { useAuth } from "../contexts/AuthContext";
import ChatRoom from "./ChatRoom";
import firebase from "../firebase";

const Post = (props) => {
  const { currentUser } = useAuth();
  const [post, setPost] = useState("");
  let title;
  //grab post from DB
  const postRef = firebase
    .firestore()
    .collection("posts")
    .doc(`${props.match.params.postId}`);

  useEffect(() => {
    async function getPostData() {
      const postFromDb = await postRef.get();
      const postData = postFromDb.data();
      setPost(postData);
    }
    getPostData();
  }, []);

  //if typeOf post === "discuss", return Discuss Comp

  //if typeOf post === "you", return You Comp

  //if typeOf post === "live", return Live Editor

  return (
    <div>
      <div>{post.title || ""}</div>
      <div>{post.description || ""}</div>
      <EditorUID uid={currentUser.uid} />
      <ChatRoom />
    </div>
  );
};

export default Post;
