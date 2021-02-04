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
  const [enableCollab, setEnableCollab] = useState(false);
  const buttonName = post.isActive ? "Close Post" : "Open Post";
  const theme = useTheme();
  const colorToToggleActive = post?.isActive
    ? theme.palette.common.colorRed
    : theme.palette.common.colorGreen;
  const colorHoverToggle = post?.isActive
    ? theme.palette.common.colorRedHover
    : theme.palette.common.colorGreenHover;

  //get post's doc reference
  const postRef = firebase.firestore().collection("posts").doc(`${postId}`);

  const ColorButton = withStyles((theme) => ({
    root: {
      color: "white",
      backgroundColor: `${colorToToggleActive}`,
      "&:hover": {
        backgroundColor: `${colorHoverToggle}`,
      },
    },
  }))(Button);

  //get post from database
  useEffect(() => {
    async function getPostData() {
      const postFromDb = await postRef.get();
      const postData = postFromDb.data();
      setPost(postData);
      setEnableCollab(postData.enableCollab)
    }    
    getPostData();
  }, []);
    
  function toggleEditor(){
    postRef.update({ enableCollab: !enableCollab });
    setEnableCollab(!enableCollab)
  }

  function toggleActive() {
    postRef.update({ isActive: !post.isActive });
    setPost({ ...post, isActive: !post.isActive });
  }

  //Dyanmic rendering of different post types below...
  if (!post) {
    return <div>Loading...</div>;
  }

  if (post.postType === "discuss" || post.postType === "you") {
    return <DiscussPost post={post} />;
  }
  if (post.postType === "live") {
    return (
      <div>
        <div>
          <button
            onClick={() => {
              firebase
                .firestore()
                .collection("posts")
                .doc(`${postId}`)
                .delete();
            }}
          >
            Remove
          </button>
        </div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Typography variant="h5">{post?.title || ""}</Typography>
          <div>
            {currentUser.uid === post.userRef && (
              <Grid>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={toggleEditor}
                >
                  Enable Collab
                </Button>
                <ColorButton variant="contained" onClick={toggleActive}>
                  {buttonName}
                </ColorButton>
              </Grid>
            )}
          </div>
        </Grid>
        <Typography>{post.description || ""}</Typography>
        <EditorUID uid={currentUser.uid} disabled={!post?.isActive} enableCollab={enableCollab}/>
        <ChatRoom disabled={!post?.isActive} postId={postId} postRef={postRef}/>   
      </div>
    );
  }
};

export default Post;
