import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import firebase from "../firebase";

import addButt from "../assets/addButt.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.colorFive,
    marginTop: "-5em",
  },
  popTopCont: {
    marginLeft: "5em",
    width: "30%",
  },
  popTopLi: {
    marginTop: ".5em",
    marginBottom: ".5em",
  },
}));

export default function Landing() {
  const classes = useStyles();
  const theme = useTheme();
  const [posts, setPosts] = useState();
  const [disccuss, setDiscuss] = useState();

  useEffect(() => {
    const postsLoc = firebase
      .firestore()
      .collection("posts")
      //  .where("postType", "==", "live")
      .orderBy("timestamp", "desc")
      .limit(5);

    postsLoc.get().then((postObj) => {
      let postsArr = postObj.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
      }));
      setPosts(postsArr);
    });

    const discussLoc = firebase
      .firestore()
      .collection("posts")
      .orderBy("timestamp")
      .where("postType", "==", "discuss")
      .limit(5);

    discussLoc.get().then((discussObj) => {
      let discussArr = discussObj.docs.map((doc) => ({
        ...doc.data(),
        discId: doc.id,
      }));
      setDiscuss(discussArr);
    });
  }, []);

  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item container style={{ marginTop: "5em" }}>
        <Grid
          item
          container
          direction="column"
          className={classes.popTopCont}
          lg={2}
        >
          <Typography style={{ marginBottom: "1em", marginTop: "4.5em" }}>
            Popular Topics
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #HTML
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #Javascript
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #CSS
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #Python
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #Firebase
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #React
          </Typography>
          <Typography style={{ marginBottom: "1em", marginTop: "4.5em" }}>
            Followed People
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            c0dergal_4555
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            gillywick786
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            LInLEExx
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            BOBAKween
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            cowcow456
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            sdfkjoive
          </Typography>
        </Grid>
        <Grid item container direction="column" lg>
          <Grid item>
            <Typography variant="h1">Your Feed</Typography>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            style={{ marginTop: "1em", marginLeft: "-1em" }}
          >
            <Button component={Link} to="/posts/add">
              <img src={addButt} alt="add button" />
            </Button>

            <Typography variant="body1" style={{ marginLeft: "1em" }}>
              Post a New Question
            </Typography>
          </Grid>
          <Grid item container>
            <Typography variant="body1">Recent Live Collab Sessions</Typography>
            {posts &&
              posts.map((post, index) => (
                <Grid key={index} item container alignItems="center">
                  <Grid
                    item
                    direction="column"
                    style={{ marginTop: ".5em", marginBottom: ".5em" }}
                  >
                    <Typography
                      component={Link}
                      to={`/posts/${post.postId}`}
                      variant="body2"
                    >
                      {post.title}
                    </Typography>
                    <Grid item>
                      <Typography variant="body2">#hashtags</Typography>
                    </Grid>
                  </Grid>
                  <Grid item style={{ marginLeft: "2em" }}>
                    <Typography variant="body2">Status:</Typography>
                    <Typography variant="body2" style={{ fontWeight: 300 }}>
                      In Collab
                    </Typography>
                  </Grid>
                  <Grid item style={{ marginLeft: "2em" }}>
                    <Typography variant="body2">Created By:</Typography>
                    <Typography variant="body2" style={{ fontWeight: 300 }}>
                      In Collab
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
          <Grid item container style={{ marginTop: "5em" }}>
            <Typography variant="body1">Recent Discussions</Typography>
            {disccuss &&
              disccuss.map((disc, index) => (
                <Grid key={index} item container alignItems="center">
                  <Grid
                    item
                    direction="column"
                    style={{ marginTop: ".5em", marginBottom: ".5em" }}
                  >
                    <Typography
                      component={Link}
                      to={`/posts/${disc.discId}`}
                      variant="body2"
                    >
                      {disc.title}
                    </Typography>
                    <Grid item>
                      <Typography variant="body2">#hashtags</Typography>
                    </Grid>
                  </Grid>
                  <Grid item style={{ marginLeft: "2em" }}>
                    <Typography variant="body2">Status:</Typography>
                    <Typography variant="body2" style={{ fontWeight: 300 }}>
                      In Collab
                    </Typography>
                  </Grid>
                  <Grid item style={{ marginLeft: "2em" }}>
                    <Typography variant="body2">Created By:</Typography>
                    <Typography variant="body2" style={{ fontWeight: 300 }}>
                      In Collab
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
