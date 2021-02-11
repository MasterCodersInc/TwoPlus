import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import { useParams, useHistory } from "react-router-dom";
import * as timeago from "timeago.js";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";

import rect from "../assets/userACCrec.svg";
import UserFollowing from "./UserFollowing";
import UserFollowers from "./UserFollowers";
import { id } from "date-fns/locale";

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: "absolute",
    zIndex: -1,
  },
  tabs: {
    marginLeft: "3em",
    marginTop: "3em",
  },
  tab: {
    textTransform: "none",
    fontFamily: "Montserrat",
    fontWeight: "500",
    color: theme.palette.common.colorTwo,
    "&:hover": {
      backgroundColor: theme.palette.common.colorFive,
    },
  },
  infoCont: {
    marginTop: "8em",
  },
  infoText: {
    //     marginTop: "2em",
    marginLeft: "5em",
  },
  followButton: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    fontFamily: "Montserrat",
    padding: ".3em",
    marginLeft: "2em",
    height: "fit-content",
  },
}));

export default function PublicProfile() {
  const history = useHistory();
  const { profileUID } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const [user, setUser] = useState({});
  const { currentUser, firestoreUser } = useAuth();

  const [isFollowing, setIsFollowing] = useState(false);
  const [userPostList, setUserPostList] = useState(null);

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

  useEffect(() => {
    async function getUserAndPosts() {
      const userObjLoc = await firebase
        .firestore()
        .collection("users")
        .where("uid", "==", profileUID);
      let userData = await userObjLoc.get();
      let publicUser = userData.docs[0];
      setUser({ ...publicUser.data(), docID: publicUser.id });

      const postRefs = firebase
        .firestore()
        .collection("posts")
        .where("userRef", "==", publicUser.data().uid);

      let postsArr = await postRefs.get();
      postsArr = postsArr.docs.map((doc) => ({ ...doc.data(), docID: doc.id }));
      setUserPostList(postsArr);
    }
    getUserAndPosts();
  }, []);

  const followUser = async (e) => {
    await firestoreUser.update({ following: arrayUnion(user.uid) });
    await user.docID.update({ followers: arrayUnion(firestoreUser.uid) });
  };

  const unfollowUser = async (e) => {
    await firestoreUser.update({ following: arrayRemove(user.uid) });
    await user.docID.update({ followers: arrayRemove(firestoreUser.uid) });
  };

  const followAndUnfollowClickHandler = (e) => {};

  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item container direction="row" style={{ marginLeft: "5em" }}>
          <Typography variant="h1" style={{ marginBottom: ".25em" }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Button
            classes={{ root: classes.followButton }}
            onClick={followAndUnfollowClickHandler}
          >
            {profileUID !== currentUser.uid &&
              (!isFollowing ? "Follow" : "Unfollow")}
          </Button>
        </Grid>
        <Grid container direction="row" style={{ marginLeft: "5em" }}>
          <Grid item>
            <img
              style={{
                width: 150,
                height: 150,
                borderRadius: 20,
                border: "2px solid #F8F8F8",
                objectFit: "cover",
              }}
              src={user.profilePhotoURL}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            style={{ width: "fit-content" }}
          >
            <Grid item direction="row" style={{ marginLeft: "1em" }}>
              <Tabs>
                <Tab
                  label={user.firstName + "'s posts"}
                  className={classes.tab}
                />
                <Tab
                  component={Link}
                  to="/userFollowers"
                  className={classes.tab}
                  label="Followers"
                ></Tab>
                <Tab
                  component={Link}
                  to="/userFollowings"
                  className={classes.tab}
                  label="Following"
                ></Tab>
              </Tabs>
            </Grid>

            <Grid item id="postsContainer">
              {userPostList &&
                userPostList.map((post) => {
                  return (
                    <div
                      style={{
                        marginLeft: "2em",
                        backgroundColor: "#F8F8F8",
                        boxShadow: "5px 5px 9px -3px rgba(136,157,226,0.25)",
                        width: "60vw",
                        padding: 10,
                        paddingTop: 10,
                        borderRadius: 10,
                        marginBottom: 15,
                      }}
                    >
                      <Typography
                        component={Link}
                        style={{ textDecoration: "none", color: "#5B56E9" }}
                        to={`/posts/${post.docID}`}
                        variant="h2"
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="body2" style={{ marginTop: 4 }}>
                        {post.description}
                      </Typography>
                      {post.timestamp && (
                        <Typography
                          variant="subtitle1"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          Asked {timeago.format(post.timestamp.seconds * 1000)}
                        </Typography>
                      )}
                      {post.postType && (
                        <Typography variant="subtitle1">
                          Post type: {post.postType}
                        </Typography>
                      )}
                    </div>
                  );
                })}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container className={classes.tabs}></Grid>
      </Grid>
    </Grid>
  );
}
