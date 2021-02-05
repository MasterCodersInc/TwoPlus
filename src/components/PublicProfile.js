import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import { useParams } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";

import rect from "../assets/userACCrec.svg";

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: "absolute",
    zIndex: -1,
  },
  tabs: {
    marginLeft: "5em",
    marginTop: "3em",
  },
  tab: {
    textTransform: "none",
    fontFamily: "Montserrat",
    fontWeight: "500",
    color: theme.palette.common.colorTwo,
  },
  infoCont: {
    marginTop: "8em",
  },
  infoText: {
    //     marginTop: "2em",
    marginLeft: "5em",
  },
  editButton: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    fontFamily: "Montserrat",
    width: "5em",
    marginLeft: "15em",
  },
}));

export default function PublicProfile() {
  const { userID } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const [user, setUser] = useState({});
  const [userPostList, setUserPostList] = useState(null);
  const db = firebase.firestore();

  // in a use effect to trigger the re-render
  useEffect(() => {
    async function getUserAndPosts() {
      const userObjLoc = await firebase
        .firestore()
        .collection("users")
        .where("uid", "==", userID);
      let userData = await userObjLoc.get();
      userData = userData.docs[0].data();
      setUser(userData);
      const postRefs = db
        .collection("posts")
        .where("userRef", "==", userData.uid);

      let postsArr = await postRefs.get();
      postsArr = postsArr.docs.map((doc) => ({ ...doc.data(), docID: doc.id }));
      setUserPostList(postsArr);
    }

    getUserAndPosts();
  }, []);

  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item style={{ marginLeft: "5em" }}>
          <Typography variant="h1" style={{ marginBottom: ".25em" }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Grid item container direction="row">
            <img
              style={{
                width: 150,
                height: 150,
                borderRadius: 20,
                border: "2px solid #F8F8F8",
              }}
              src="https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
            />
            <Grid item>
              <Tabs>
                <Tab
                  label={user.firstName + "'s posts"}
                  className={classes.tab}
                />
              </Tabs>
              <Grid container id="postsContainer">
                {userPostList &&
                  userPostList.map((post) => {
                    return (
                      <div
                        style={{
                          marginLeft: "2em",
                          backgroundColor: "#F8F8F8",
                          boxShadow: "6px 7px 12px 1px rgba(136,157,226,0.39)",
                          width: "60vw",
                          padding: 10,
                          paddingTop: 0,
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
                        <h4>{post.description}</h4>
                        {post.timestamp && (
                          <small>Asked on {post.timestamp.toString()}</small>
                        )}
                        <br></br>
                        {post.postType && (
                          <small>post type: {post.postType}</small>
                        )}
                      </div>
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container className={classes.tabs}></Grid>
      </Grid>
    </Grid>
  );
}
