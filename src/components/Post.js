import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EditorUID from "./EditorUID";
import { useAuth } from "../contexts/AuthContext";
import ChatRoom from "./ChatRoom";
import firebase from "../firebase";
import { Typography, Button, Grid, Tooltip } from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import DiscussPost from "./DiscussPost";
import DeletePost from "./DeletePost";
import PlusPlusButton from "./PlusPlusButton";
import openPost from "../assets/openPostCircle.svg";
import closedPost from "../assets/closedPostCircle.svg";

const useStyles = makeStyles((theme) => ({
  button1: {
    color: 'white',
    backgroundColor: theme.palette.common.colorTwo,
  },
  link: {
    ...theme.link.normal,
  },
  buttonN: {
    ...theme.button.normal,
  },
  livePost: {
    minWidth: '47.5vw',
    minHeight: '47.5vh',
  },
}));

const Post = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser, firestoreUser } = useAuth();
  const { postId } = useParams();
  const [post, setPost] = useState('');
  const [enableCollab, setEnableCollab] = useState(false);
  const buttonName = post.isActive ? 'Close Post' : 'Open Post';
  const colorToToggleActive = post?.isActive
    ? theme.palette.common.colorRed
    : theme.palette.common.colorGreen;
  const colorHoverToggle = post?.isActive
    ? theme.palette.common.colorRedHover
    : theme.palette.common.colorGreenHover;

  //get post's doc reference
  const postRef = firebase.firestore().collection('posts').doc(`${postId}`);

  //get post from database
  useEffect(() => {
    async function getPostData() {
      const postFromDb = await postRef.get();
      const postData = postFromDb.data();
      setPost({ ...postData, postId: postFromDb.id });
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

  if (post.postType === 'discuss' || post.postType === 'you') {
    return <DiscussPost post={post} />;
  }
  if (post.postType === 'live') {
    return (
      <Grid container className={classes.livePost}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid
            item
            container
            direction="column"
            style={{ marginLeft: '3.2em' }}
          >
            {' '}
            <Grid
              container
              direction="row"
              alignItems="center"
              style={{ marginBottom: '1.5em' }}
            >
              <Grid item style={{ marginRight: '2em' }}>
                <PlusPlusButton documentRef={postId} />
              </Grid>
              <Grid item alignContent="flex-end">
                <Grid item container direction='row' align="center">
                  <Typography variant="h2">{post?.title || ""}&nbsp;</Typography>
                  <Tooltip 
                    title={post.isActive ? 'Live' : 'Closed'}
                    arrow
                    placement="right"
                    >
                    <img
                      src={post.isActive ? openPost : closedPost}
                      alt={post.isActive ? 'greencircle' : 'redcircle'}
                      style={{ marginRight: ".5em" }}
                    />
                  </Tooltip>
                </Grid>
                <Typography
                  variant="body2"
                  style={{ marginTop: '1em', marginBottom: '1em' }}
                >
                  {post.description || ''}
                </Typography>
                <Grid item container direction="row">
                  {post.tags.map((tag) => (
                    <Link
                      className={classes.link}
                      style={{ marginRight: '1em' }}
                      to={`/posts?tag=${tag}`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container style={{ marginTop: '.6em' }}>
            {currentUser &&
              (currentUser.uid === post.userRef || firestoreUser?.isAdmin) && (
                <Grid item container>
                  <Button
                    variant="contained"
                    classes={{ root: classes.buttonN }}
                    onClick={toggleActive}
                  >
                    {buttonName}
                  </Button>
                  <DeletePost postId={post.postId} fontSize="medium" />
                </Grid>
              )}
          </Grid>
        </Grid>

        <Grid item container lg>
          <Grid item>
            <EditorUID
              uid={currentUser?.uid}
              disabled={!post?.isActive}
              enableCollab={enableCollab}
            />
          </Grid>
          <div />
          <Grid item lg style={{ maxWidth: '25em', marginLeft: '-2em' }}>
            <ChatRoom
              disabled={!post?.isActive}
              postId={postId}
              postRef={postRef}
              lg
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
};

export default Post;
