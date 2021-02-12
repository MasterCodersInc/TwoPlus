import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import DeletePost from './DeletePost';

import rect from "../assets/userACCrec.svg";
import UserFollowers from "../components/UserFollowers";
import UserFollowing from "../components/UserFollowing";

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: "absolute",
    zIndex: -1,
  },
  tabs: {
    marginLeft: "2.5em",
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
    marginTop: "2em",
    marginLeft: "2.3em",
    // maxWidth: '50%'
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
  postLink: {
    textDecoration: "none",
    color: theme.palette.common.colorOne,
    "&:hover": {
      color: theme.palette.common.colorThree,
    },
  },
  card: {
    padding: "1em",
    width: "90%",
    marginTop: "1em",
    marginBottom: "1em",
    borderRadius: 30,
    backgroundColor: theme.palette.common.colorFive,
  },
}));

export default function UserProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const email = currentUser.email;
  const UID = currentUser.uid;

  // in a use effect to trigger the re-render
  useEffect(() => {
    const userObjLoc = db.collection("users").where("email", "==", `${email}`);

    // a pointer/reference of the data that we want
    userObjLoc.get().then((objData) => {
      // giving back an array of data objs that matches
      objData.forEach((doc) => setUser(doc.data()));
    });

    const userPosts = db.collection("posts").where("userRef", "==", `${UID}`);
    userPosts.get().then((postObj) => {
      let postsArr = postObj.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(postsArr);
      setUserPosts(postsArr);
    });
  }, []);

  return (
    <Grid container style={{maxWidth: '90vh', minHeight: '53.5vh'}}>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h1" style={{ marginLeft: "2.3em" }}>
            Welcome, {user && user.firstName}
          </Typography>
        </Grid>
        <Grid item container className={classes.tabs}>
          <Tabs>
            <Tab
              component={Link}
              to="profile"
              label="Your Info"
              className={classes.tab}
            />
            <Tab label="My Posts" className={classes.tab} />
            <Tab
              component={Link}
              to="/savedcontent"
              label="++Content"
              className={classes.tab}
            />
            <Tab
              component={Link}
              to="/userFollowers"
              label="followers"
              className={classes.tab}
            />
            <Tab
              component={Link}
              to="/userFollowings"
              label="following"
              className={classes.tab}
            />
          </Tabs>
        </Grid>
        <Grid item container alignItems="center" className={classes.infoCont}>
          {!userPosts.length ? (
            <Typography style={{ marginLeft: "2.3em" }} variant="body1">
              You don't have any posts yet, you should try asking a question!
            </Typography>
          ) : (
            userPosts.map((post) => (
              <Card className={classes.card}>
                <Grid container direction="row" alignContent="flex-start">
                  <Grid item container lg={5} direction="column" style={{ marginLeft: "1em"}}>
                    <Link to={`/posts/${post.id}`} className={classes.postLink}>
                      <Typography>{post.title}</Typography>
                    </Link>
                    <Typography>{post.description}</Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    style={{
                      width: "50%",
                      color: theme.palette.common.colorTwo,
                    }}
                    lg
                  >
                    <Typography variant="body2">Created By</Typography>
                    <Typography variant="body2">{user.firstName}</Typography>
                  </Grid>
                  <DeletePost fontSize='small' postId={post.id} />
                </Grid>
              </Card>
            ))
          )}
          {/* <Grid>{userPosts[0]?.title}</Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}
