import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditorUID from "./EditorUID";
import { useAuth } from "../contexts/AuthContext";
import ChatRoom from "./ChatRoom";
import firebase from "../firebase";
import { Typography, Button, Grid } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import DiscussPost from "./DiscussPost";

const useStyles = makeStyles((theme) => ({
  button1: {
    color: "white",
    backgroundColor: theme.palette.common.colorTwo,
    "&:hover": {
      backgroundColor: `${colorHoverToggle}`,
    },
  },
}));

const Post = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState("");
  const [enableCollab, setEnableCollab] = useState(false);
  const buttonName = post.isActive ? "Close Post" : "Open Post";
  const colorToToggleActive = post?.isActive
    ? theme.palette.common.colorRed
    : theme.palette.common.colorGreen;
  const colorHoverToggle = post?.isActive
    ? theme.palette.common.colorRedHover
    : theme.palette.common.colorGreenHover;

  //get post's doc reference
  const postRef = firebase.firestore().collection("posts").doc(`${postId}`);

  //get post from database
  useEffect(() => {
    async function getPostData() {
      const postFromDb = await postRef.get();
      const postData = postFromDb.data();
      setPost(postData);
      setEnableCollab(postData.enableCollab);
    }
    getPostData();
  }, []);

  function toggleEditor() {
    postRef.update({ enableCollab: !enableCollab });
    setEnableCollab(!enableCollab);
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
      <Grid container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item container direction="center">
            {" "}
            <Typography variant="h2">{post?.title || ""}</Typography>
            <Typography variant="body1">{post.description || ""}</Typography>
          </Grid>
          <Grid item container>
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
          </Grid>
        </Grid>

        <EditorUID
          uid={currentUser.uid}
          disabled={!post?.isActive}
          enableCollab={enableCollab}
        />
        <ChatRoom
          disabled={!post?.isActive}
          postId={postId}
          postRef={postRef}
        />
      </Grid>
    );
  }
};

export default Post;