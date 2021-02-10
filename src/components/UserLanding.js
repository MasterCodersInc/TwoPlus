import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

import firebase from "../firebase";

import addButt from "../assets/addButt.svg";
import userLandingRec from "../assets/userLandingRec.svg";
import defaultProfile from "../assets/defaultProfile.svg";
import openPost from "../assets/openPostCircle.svg";
import closedPost from "../assets/closedPostCircle.svg";
import DeletePost from "./DeletePost";

const useStyles = makeStyles((theme) => ({
  container: {
    //     backgroundColor: theme.palette.common.colorFive,
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
  testBox: {
    backgroundColor: "black",
    width: "3em",
    height: "3em",
    boxShadow: "-5 -5 10 0 #FFFFFF",
    //     box-shadow: [horizontal offset] [vertical offset] [blur radius] [optional spread radius] [color];
  },
  followButt: {
    backgroundColor: theme.palette.common.colorThree,
    fontFamily: "Montserrat",
    color: "#fff",
    height: "1.5em",
    fontSize: ".7em",
    marginLeft: "1em",
    "&:hover": {
      backgroundColor: theme.palette.common.colorFour,
    },
  },
  postLink: {
    textDecoration: "none",
    color: "black",
    fontWeight: 500,
    width: "90%",
    "&:hover": {
      color: theme.palette.common.colorThree,
    },
  },
  postLink2: {
    textDecoration: "none",
    color: "black",
    fontWeight: 500,
    width: "90%",
    "&:hover": {
      color: theme.palette.common.colorThree,
    },
  },
  postLink3: {
    textDecoration: "none",
    color: theme.palette.common.colorOne,
    fontWeight: 600,
    width: "90%",
    "&:hover": {
      color: "black",
    },
  },
}));

export default function Landing() {
  const classes = useStyles();
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [disccuss, setDiscuss] = useState([]);
  const [tags, setTags] = useState([]);

  async function updatePhotos(arr) {
    const postCopy = arr.slice();
    for (const post of postCopy) {
      let picRef = post.userPhotoURL;
      if (typeof picRef !== "string" && picRef) {
        let pic = await picRef.get();
        post.userPhotoURL = pic.data().profilePhotoURL;
      }
    }
    setPosts(postCopy);
  }

  useEffect(() => {
    const postsLoc = firebase
      .firestore()
      .collection("posts")
      .where("postType", "==", "live")
      .orderBy("timestamp", "desc")
      .limit(6);

    postsLoc
      .get()
      .then((postObj) => {
        let postsArr = postObj.docs.map((doc) => ({
          ...doc.data(),
          postId: doc.id,
        }));
        return postsArr;
      })
      .then((postsArr) => {
        updatePhotos(postsArr);
      });

    const discussLoc = firebase
      .firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
      .where("postType", "==", "discuss")
      .limit(6);

    discussLoc.get().then((discussObj) => {
      let discussArr = discussObj.docs.map((doc) => ({
        ...doc.data(),
        discId: doc.id,
      }));
      setDiscuss(discussArr);
    });

    const tagsLoc = firebase
      .firestore()
      .collection("tags")
      .orderBy("count", "desc")
      .limit(6);

    tagsLoc.get().then((tagsObj) => {
      let tagsArr = tagsObj.docs.map((doc) => ({
        ...doc.data(),
      }));
      setTags(tagsArr);
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
          <Grid item className={classes.testBox}></Grid>
          <Typography style={{ marginBottom: "1em", marginTop: "4.5em" }}>
            Popular Topics
          </Typography>

          {tags.map((tag, idx) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Typography variant="body2" className={classes.popTopLi}>
                  {idx}. &nbsp;
                </Typography>
              </div>
              <div>
                <Typography
                  variant="body2"
                  className={(classes.popTopLi, classes.postLink3)}
                  component={Link}
                  to={`/posts?tag=${tag.name}`}
                >
                  #{tag.name}
                </Typography>
              </div>
            </div>
          ))}

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
            style={{ marginTop: "1.5em" }}
          >
            <Typography variant="h1" style={{ fontSize: "1.5em" }}>
              Recent Q's
            </Typography>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            style={{ marginTop: "1em", marginLeft: "-1em" }}
          ></Grid>
          <Grid item container>
            <Grid
              item
              container
              alignItems="center"
              style={{ marginBottom: "1em" }}
            >
              <Typography variant="body1">Post a New Question</Typography>
              <Button
                component={Link}
                to="/posts/add"
                style={{ marginLeft: "1em" }}
              >
                <img src={addButt} alt="add button" />
              </Button>
            </Grid>
            {posts &&
              posts.map((post, index) => {
                return (
                  <Card
                    style={{
                      width: "18em",
                      margin: ".5em",
                      paddingBottom: "1em",
                      backgroundColor: theme.palette.common.colorFive,
                      borderRadius: 15,
                    }}
                  >
                    <Grid
                      key={index}
                      item
                      direction="column"
                      container
                      alignItems="center"
                    >
                      <Grid
                        item
                        container
                        alignItems="center"
                        style={{ marginTop: "1em", marginLeft: "1em" }}
                      >
                        <img
                          src={post.userPhotoURL || defaultProfile}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 5,
                          }}
                          alt="default profile img"
                        />
                        <Typography
                          component={Link}
                          to={`users/${post.userRef}`}
                          style={{ marginLeft: ".5em", textDecoration: "none" }}
                        >
                          {post.userName}
                        </Typography>
                        <Button classes={{ root: classes.followButt }}>
                          follow
                        </Button>
                      </Grid>
                      <Grid
                        container
                        alignItems="flex-start"
                        style={{ width: "90%", marginTop: ".5em" }}
                      >
                        <img
                          src={post.isActive ? openPost : closedPost}
                          alt={post.isActive ? "greencircle" : "redcircle"}
                          style={{ marginRight: ".5em" }}
                        />
                        <Typography
                          component={Link}
                          to={`/posts/${post.postId}`}
                          variant="body2"
                          className={classes.postLink}
                        >
                          {post.title}
                        </Typography>
                        <Grid
                          item
                          style={{ marginTop: ".5em", marginLeft: "1em" }}
                        ></Grid>
                      </Grid>

                      <Grid item container direction="row">
                        {post.tags.slice(0, 3).map((tag) => {
                          return (
                            <Grid item>
                              <Typography
                                component={Link}
                                to={`/posts/?tag=${tag}`}
                                className={classes.postLink}
                                variant="body2"
                                noWrap
                                style={{
                                  color: "white",
                                  width: "fit-content",
                                  backgroundColor:
                                    theme.palette.common.colorOne,
                                  marginRight: 4,
                                  marginTop: 4,
                                  marginBottom: 4,
                                  padding: 2,
                                  borderRadius: 2,
                                }}
                              >
                                #{tag}
                              </Typography>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </Card>
                );
              })}
          </Grid>
          <Grid item container style={{ marginTop: "5em" }}>
            <Typography
              variant="h1"
              style={{ fontSize: "1.5em", marginBottom: "1em" }}
            >
              Recent Discussions
            </Typography>
            {disccuss &&
              disccuss.map((disc, index) => (
                <Grid key={index} item container alignItems="center">
                  <Grid
                    item
                    direction="column"
                    style={{
                      marginTop: ".5em",
                      marginBottom: ".5em",
                      width: "20em",
                    }}
                  >
                    <Typography
                      component={Link}
                      to={`/posts/${disc.discId}`}
                      variant="body2"
                      className={classes.postLink2}
                    >
                      {disc.title}
                    </Typography>
                    <Grid item container direction="row">
                      {disc.tags?.map((tag) => {
                        return (
                          <Typography
                            variant="body2"
                            style={{
                              color: "white",
                              width: "fit-content",
                              backgroundColor: theme.palette.common.colorOne,
                              marginRight: 4,
                              marginTop: 4,
                              marginBottom: 4,
                              padding: 2,
                              borderRadius: 2,
                            }}
                          >
                            #{tag}
                          </Typography>
                        );
                      })}
                    </Grid>
                  </Grid>

                  <Grid item style={{ marginLeft: "2em", width: "10em" }}>
                    <Typography
                      variant="body2"
                      style={{
                        color: theme.palette.common.colorTwo,
                        fontSize: ".8em",
                      }}
                    >
                      Created By:
                    </Typography>
                    <Typography variant="body2" style={{ fontWeight: 300 }}>
                      {disc.userName}
                    </Typography>
                    <DeletePost postId={disc.discId} fontSize="small" />
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
