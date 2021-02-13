import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PlusPlusButton from "./PlusPlusButton";
import Footer from "./Footer";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

import firebase from "../firebase";

import addButt from "../assets/addButt.svg";
import FrontPageFollowButton from "./FrontPageFollowButton";
import userLandingRec from "../assets/userLandingRec.svg";
import defaultProfile from "../assets/defaultProfile.svg";
import openPost from "../assets/openPostCircle.svg";
import closedPost from "../assets/closedPostCircle.svg";
import DeletePost from "./DeletePost";
import { useAuth } from "../contexts/AuthContext";

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
    marginTop: ".5em",
    fontSize: "1.2em",
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
  postLink4: {
    textDecoration: "none",
    color: "black",
    fontWeight: 500,
    width: "90%",
    "&:hover": {
      color: theme.palette.common.colorThree,
    },
  },
  sortButton: {
    cursor: "pointer",
    backgroundColor: theme.palette.common.colorFive,
    "&:hover": {
      backgroundColor: theme.palette.common.colorFour,
    },
    padding: 5,
    borderRadius: 10,
    marginRight: "1em",
  },
  sortButtonSelected: {
    cursor: "pointer",
    backgroundColor: theme.palette.common.colorFour,
    color: theme.palette.common.colorOne,
    padding: 5,
    borderRadius: 10,
    marginRight: "1em",
  },
}));

export default function Landing() {
  const classes = useStyles();
  const theme = useTheme();
  const { firestoreUser } = useAuth();

  const [posts, setPosts] = useState([]);
  const [discuss, setDiscuss] = useState([]);
  const [tags, setTags] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [followingUIDs, setFollowingUIDs] = useState([]);
  const [frontPageSort, setFrontPageSort] = useState("timestamp");

  const followButtonRef = React.useRef();

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

  const isInitialMount = React.useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    } else {
      getFollowing();
      isInitialMount.current = true;
    }
  });

  async function getFollowing() {
    let followingList = [];
    for (const user of firestoreUser.following) {
      const followingRef = firebase
        .firestore()
        .collection("users")
        .where("uid", "==", user);
      const followingData = await followingRef.get();
      followingList.push(followingData.docs[0].data());
    }
    setUserFollowing(followingList);
    setFollowingUIDs(followingList.map((user) => user.uid));
  }

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
      .orderBy(frontPageSort, "desc")
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
      .orderBy(frontPageSort, "desc")
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
    isInitialMount.current = false;
  }, [frontPageSort]);

  async function followUser(userUIDToFollow) {
    const userObjLoc = await firebase
      .firestore()
      .collection("users")
      .where("uid", "==", userUIDToFollow);
    let userData = await userObjLoc.get();
    let userDocToFollow = userData.docs[0];

    await firebase
      .firestore()
      .collection("users")
      .doc(firestoreUser.userDocRef)
      .update({ following: arrayUnion(userUIDToFollow) });
    await firebase
      .firestore()
      .collection("users")
      .doc(userDocToFollow.id)
      .update({ followers: arrayUnion(firestoreUser.uid) });
  }

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

          <Typography style={{ marginBottom: ".5em", marginTop: "4.5em" }}>
            Followed Users
          </Typography>
          {userFollowing &&
            userFollowing.map((user) => {
              return (
                <Typography
                  component={Link}
                  to={`/users/${user.uid}`}
                  variant="body2"
                  className={(classes.popTopLi, classes.postLink3)}
                  style={{ marginBottom: "1em" }}
                >
                  {user.userName}
                </Typography>
              );
            })}
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
              <Grid
                item
                container
                alignItems="center"
                style={{ marginTop: "1.5em" }}
              >
                <Grid item>
                  <Typography variant="h1" style={{ fontSize: "1.2em" }}>
                    Recent Questions
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {posts &&
              posts.map((post, index) => {
                return (
                  <Card
                    style={{
                      width: "22em",
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
                        container
                        alignItems="flex-start"
                        style={{
                          width: "90%",
                          marginTop: ".5em",
                          maxHeight: "10em",
                          minHeight: "4em",
                        }}
                      >
                        <img
                          src={post.isActive ? openPost : closedPost}
                          alt="greencircle"
                          style={{ marginRight: ".5em", marginTop: ".9em" }}
                        />
                        {/* ================================================================================================== */}
                        <Typography
                          component={Link}
                          to={`/posts/${post.postId}`}
                          variant="body2"
                          className={classes.postLink}
                        >
                          {post.title.length > 40
                            ? post.title.slice(0, 40).concat("...")
                            : post.title}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        container
                        alignItems="center"
                        style={{
                          marginTop: "1em",
                          marginLeft: "1em",
                          marginBottom: ".5em",
                        }}
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
                          variant="body2"
                          style={{ marginLeft: ".5em", textDecoration: "none" }}
                        >
                          {post.userName}
                        </Typography>
                        <div></div>
                        {followingUIDs && (
                          <FrontPageFollowButton
                            followUser={followUser}
                            firestoreUser={firestoreUser}
                            post={post}
                            followingUIDs={followingUIDs}
                          />
                        )}
                      </Grid>

                      <Grid
                        item
                        container
                        direction="row"
                        style={{ marginLeft: "1.2em" }}
                      >
                        {post.tags.slice(0, 3).map((tag) => {
                          return (
                            <Grid item zeroMinWidth>
                              <Typography
                                component={Link}
                                to={`/posts/?tag=${tag}`}
                                className={classes.postLink4}
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

                      <PlusPlusButton
                        frontPageSort={frontPageSort}
                        documentRef={post.postId}
                        size="small"
                        style={{ marginRight: "3em" }}
                      />
                    </Grid>
                  </Card>
                );
              })}
          </Grid>
          <Grid item container style={{ marginTop: "3em" }}>
            <Typography variant="h1" style={{ fontSize: "1.5em" }}>
              Recent Discussions
            </Typography>
            {discuss &&
              discuss.map((disc, index) => (
                <Grid key={index} item container alignItems="center">
                  <Grid
                    direction="row"
                    item
                    container
                    style={{ marginRight: ".7em", width: "6em" }}
                  >
                    <PlusPlusButton documentRef={disc.discId} size="small" />
                  </Grid>
                  <Grid
                    item
                    direction="column"
                    justify="flex-end"
                    style={{
                      marginTop: ".5em",
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
                    <Typography
                      component={Link}
                      to={`/users/${disc.userRef}`}
                      variant="body2"
                      style={{ fontWeight: 500, textDecoration: "none" }}
                    >
                      {disc.userName}
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
