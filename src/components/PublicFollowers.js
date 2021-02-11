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

export default function PublicFollowers() {
  const history = useHistory();
  const { profileUID } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser, firestoreUser } = useAuth();

  const [publicUser, setPublicUser] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [userFollowerList, setUserFollowerList] = useState(null);

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

  useEffect(() => {
    async function getUserAndFollowers() {
      const userObjLoc = await firebase
        .firestore()
        .collection("users")
        .where("uid", "==", profileUID);
      let userData = await userObjLoc.get();
      let publicUser = userData.docs[0];
      setPublicUser({ ...publicUser.data(), docID: publicUser.id });

      if (publicUser.data().followers.includes(currentUser.uid)) {
        setIsFollowing(true);
      }
      let followerList = [];
      for (const user of publicUser.data().followers) {
        const followingRef = firebase
          .firestore()
          .collection("users")
          .where("uid", "==", user);
        const followingData = await followingRef.get();
        followerList.push(followingData.docs[0].data());
      }
      setUserFollowerList(followerList);
    }
    getUserAndFollowers();
  }, []);

  const followUser = async (e) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(firestoreUser.userDocRef)
      .update({ following: arrayUnion(publicUser.uid) });

    await firebase
      .firestore()
      .collection("users")
      .doc(publicUser.docID)
      .update({ followers: arrayUnion(firestoreUser.uid) });
    setIsFollowing(!isFollowing);
  };

  const unfollowUser = async (e) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(firestoreUser.userDocRef)
      .update({ following: arrayRemove(publicUser.uid) });

    await firebase
      .firestore()
      .collection("users")
      .doc(publicUser.docID)
      .update({
        followers: arrayRemove(firestoreUser.uid),
      });
    setIsFollowing(!isFollowing);
  };

  const followAndUnfollowClickHandler = (e) => {
    if (isFollowing) {
      unfollowUser();
    }
    if (!isFollowing) {
      followUser();
    }
  };
  console.log(userFollowerList);
  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item container direction="row" style={{ marginLeft: "5em" }}>
          <Typography variant="h1" style={{ marginBottom: ".25em" }}>
            {publicUser.firstName} {publicUser.lastName}
          </Typography>
          {profileUID !== currentUser?.uid && (
            <Button
              classes={{ root: classes.followButton }}
              onClick={followAndUnfollowClickHandler}
            >
              {!isFollowing ? "Follow" : "Unfollow"}
            </Button>
          )}
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
              src={publicUser.profilePhotoURL}
            />
          </Grid>
          <Grid
            item
            container
            direction="column"
            style={{ width: "fit-content" }}
          >
            <Grid
              item
              direction="row"
              style={{ marginLeft: "1em", marginBottom: "1em" }}
            >
              <Tabs>
                <Tab
                  label={publicUser.firstName + "'s posts"}
                  className={classes.tab}
                  component={Link}
                  to={`/users/${profileUID}/`}
                />
                <Tab
                  style={{ backgroundColor: theme.palette.common.colorFive }}
                  className={classes.tab}
                  label="Followers"
                ></Tab>
                <Tab
                  component={Link}
                  onClick={() => {
                    history.push(`/users/${profileUID}/following`);
                  }}
                  className={classes.tab}
                  label="Following"
                ></Tab>
              </Tabs>
            </Grid>
            <Grid item id="postsContainer">
              {userFollowerList &&
                (!userFollowerList.length ? (
                  <Typography style={{ marginLeft: "3em" }}>
                    This user has no followers.
                  </Typography>
                ) : (
                  userFollowerList.map((follower) => {
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
                        <Grid container alignItems="center" direction="row">
                          <img
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: 10,
                              objectFit: "cover",
                              marginRight: 5,
                            }}
                            src={follower.profilePhotoURL}
                          />
                          <Typography
                            component={Link}
                            style={{
                              textDecoration: "none",
                              color: "#5B56E9",
                              marginRight: 10,
                            }}
                            to={`/users/${follower.uid}`}
                            variant="h2"
                          >
                            {follower.userName}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ marginRight: 10 }}
                          >
                            Followers:{follower.followers.length}
                          </Typography>
                          <Typography variant="body2">
                            Following:{follower.following.length}
                          </Typography>
                        </Grid>
                      </div>
                    );
                  })
                ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container className={classes.tabs}></Grid>
      </Grid>
    </Grid>
  );
}
