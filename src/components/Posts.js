import React, { useEffect, useState } from "react";
import { Grid, Typography, makeStyles, useTheme } from "@material-ui/core";
import { useLocation, Link, useHistory } from "react-router-dom";
import firebase from "../firebase";
import Box from "@material-ui/core/Box";
import * as timeago from "timeago.js";
import logoSpin from "../assets/logo-spin.gif";

const useStyles = makeStyles((theme) => ({
  searchPage: {
    padding: "2%",
    margin: "2%",
  },
  pageHeader: {
    margin: "2%",
  },

  shadowRectangle: {
    zIndex: -1,
  },
  post: {
    width: "80%",
    margin: "2%",
  },
  postInfo: {
    backgroundColor: "#ECEDF0",
    padding: "2%",
  },
  postLink: {
    textDecoration: "none",
    color: "black",
    fontWeight: 500,
    "&:hover": {
      color: theme.palette.common.colorThree,
    },
  },
  secondRow: {
    flexWrap: "nowrap",
  },
}));

const Posts = (props) => {
  //styling
  const classes = useStyles();
  const theme = useTheme();

  //refs
  const postsRef = firebase.firestore().collection("posts");

  //states
  const [posts, setPosts] = useState([]);

  //query
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const tag = urlParams.get("tag");

  //hooks
  const history = useHistory();
  useEffect(() => {
    if (tag) {
      getPostsByTag(tag);
    }
  }, []);

  //functions
  async function getPostsByTag(tag) {
    try {
      const postsColl = await postsRef
        .where("tags", "array-contains", `${tag}`)
        .get();
      const posts = await postsColl.docs.map((postDoc) => {
        return { ...postDoc.data(), postId: postDoc.id };
      });
      setPosts(posts);
    } catch (error) {
      console.log(`Unable to get posts with tag ${tag}`, error);
    }
  }
  if (!posts) {
    return (
      <Grid container height="100%" justify="center" alignItems="center">
        <img src={logoSpin} className={classes.loading} />
      </Grid>
    );
  }

  return (
    <Grid className={classes.searchPage}>
      <Typography className={classes.pageHeader} variant="h2">
        Search Results: {tag}
      </Typography>
      {posts.map((post) => (
        <Box key={post.postId} direction="column" className={classes.post}>
          <Box
            className={classes.postInfo}
            boxShadow={2}
            borderRadius={16}
            onClick={() => history.push(`/posts/${post.postId}`)}
          >
            <Typography
              component={Link}
              to={`/posts/${post.postId}`}
              variant="h5"
              className={classes.postLink}
            >
              {post.title}
            </Typography>
            <Grid
              className={classes.secondRow}
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Typography variant="body2">
                Asked by&nbsp;
                <Typography
                  component={Link}
                  to={`/users/${post.userRef}`}
                  variant="body1"
                  className={classes.postLink}
                >
                  {post.userName}
                </Typography>
              </Typography>
              <Typography variant="body2">
                {timeago.format(post.timestamp.seconds * 1000)}
              </Typography>
            </Grid>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

export default Posts;
