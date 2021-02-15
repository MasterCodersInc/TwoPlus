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
import {Card} from '@material-ui/core'
import DeletePost from './DeletePost'

import rect from "../assets/userACCrec.svg";

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
    marginTop: "8em",
    marginLeft: "2.3em",
    width: '2%'
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
  infoCont: {
    marginTop: "2em",
    marginLeft: "2.3em",
    // maxWidth: '50%'
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
    width: "75%",
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
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();
  const db = firebase.firestore();

  // in a use effect to trigger the re-render
  useEffect(() => {
    async function getPlusPlusContent(){
      const postsCol = await db
        .collection('posts')
        .where("plusplusList", "array-contains", `${currentUser.uid}`)
        .get();
      const posts = postsCol.docs.map(postDoc => {
        return {...postDoc.data(), postId: postDoc.id}
      })
      setPosts(posts);
    }
    getPlusPlusContent();
  }, []);

  return (
    <Grid container style={{ maxWidth: '95vw', minHeight:'53.5vh'}}>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h1" style={{ marginLeft: "2.3em" }}>
            Welcome {user && user.firstName}
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
            <Tab
              component={Link}
              to="/myposts"
              label="My Posts"
              className={classes.tab}
            />
            <Tab label="++Content" className={classes.tab} />
            <Tab
              component={Link}
              to="/userFollowers"
              label="Followers"
              className={classes.tab}
            />
            <Tab
              component={Link}
              to="/userFollowings"
              label="Following"
              className={classes.tab}
            />
          </Tabs>
        </Grid>
        <Grid item container alignItems="center" className={classes.infoCont} style={{maxWidth: '1000px'}}>
          {!posts.length ? (
              <Typography style={{ marginLeft: "2.3em" }} variant="body1">
                You don't have any saved posts yet, ++ some posts!
              </Typography>
            ) : (
              posts.map((post) => (
                <Card className={classes.card}>
                  <Grid container direction="row" alignContent="flex-start">
                    <Grid
                      item
                      container
                      lg={5}
                      direction="column"
                      style={{ marginLeft: "1em", width:'fit-content',maxWidth:'40%' }}
                    >
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
                        marginLeft: '8%',
                        maxWidth: "40%",
                        width:'fit-content',
                        color: theme.palette.common.colorTwo,
                      }}
                      lg
                    >
                      <Typography variant="body2">Created By</Typography>
                      <Typography variant="body2">{post.userName}</Typography>
                    </Grid>
                    <DeletePost fontSize="small" postId={post.id} />
                  </Grid>
                </Card>
              ))
            )}
        </Grid>
      </Grid>
    </Grid>
  );
}
