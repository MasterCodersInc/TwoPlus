import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditorUID from "./EditorUID";
import { useAuth } from "../contexts/AuthContext";
import ChatRoom from "./ChatRoom";
import firebase from "../firebase";
import { Typography, Button, Grid } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/core/styles";
import DiscussPost from "./DiscussPost";

const Post = (props) => {
  const { currentUser } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const buttonName = post.isActive ? "Close Post" : "Open Post";
  //get post's doc reference
  const postRef = firebase.firestore().collection("posts").doc(`${postId}`);

  const theme = useTheme();
  const colorToToggleActive = post?.isActive
    ? theme.palette.common.colorRed
    : theme.palette.common.colorGreen;
  const colorHoverToggle = post?.isActive ? "#aa2e25" : "#357a38";

  const ColorButton = withStyles((theme) => ({
    root: {
      color: "white",
      backgroundColor: `${colorToToggleActive}`,
      "&:hover": {
        backgroundColor: `${colorHoverToggle}`,
        // opacity: '70%'
      },
    },
  }))(Button);

  //get post from database
  useEffect(() => {
    async function getPostData() {
      const postFromDb = await postRef.get();
      const postData = postFromDb.data();
      setPost(postData);
    }
    getPostData();
  }, []);

  function toggleActive() {
    postRef.update({ isActive: !post.isActive });
    setPost({ ...post, isActive: !post.isActive });
  }

  //Dyanmic rendering of different post types below...
  if (!post) {
    return <div>Loading...</div>;
  }
  if (post.postType === "discuss") {
    return <DiscussPost post={post} />;
  }
  if (post.postType === "live") {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{post?.title || ""}</Typography>
          <Button variant="contained" color="secondary" onClick={toggleActive}>
            Let Other Users Code
          </Button>
          <ColorButton variant="contained" onClick={toggleActive}>
            {buttonName}
          </ColorButton>
        </Grid>
        <Typography>{post.description || ""}</Typography>
        <EditorUID uid={currentUser.uid} disabled={!post?.isActive} />
        <ChatRoom disabled={!post?.isActive} />
      </div>
    );
  }
};

export default Post;
