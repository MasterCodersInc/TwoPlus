import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../firebase';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import rect from '../assets/userACCrec.svg';

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: 'absolute',
    zIndex: -1,
  },
  tabs: {
    marginLeft: '2.5em',
    marginTop: '3em',
  },
  tab: {
    textTransform: 'none',
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: theme.palette.common.colorTwo,
    '&:hover': {
      backgroundColor: theme.palette.common.colorFive,
    },
  },
  infoCont: {
    marginTop: '8em',
    marginLeft: '2.3em',
  },
  infoText: {
    //     marginTop: "2em",
    marginLeft: '5em',
  },
  editButton: {
    color: '#fff',
    backgroundColor: theme.palette.common.colorOne,
    fontFamily: 'Montserrat',
    width: '5em',
    marginLeft: '15em',
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
    const userObjLoc = db.collection('users').where('email', '==', `${email}`);

    // a pointer/reference of the data that we want
    userObjLoc.get().then((objData) => {
      // giving back an array of data objs that matches
      objData.forEach((doc) => setUser(doc.data()));
    });

    const userPosts = db.collection('posts').where('userRef', '==', `${UID}`);
    userPosts.get().then((postObj) => {
      let postsArr = postObj.docs.map((doc) => ({ ...doc.data() }));
      console.log(postsArr);
      setUserPosts(postsArr);
    });
  }, []);

  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h1" style={{ marginLeft: '2.3em' }}>
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
            <Tab label="Saved Collabs" className={classes.tab} />
            <Tab
              component={Link}
              to="/savedcontent"
              label="++Content"
              className={classes.tab}
            />
          </Tabs>
        </Grid>
        <Grid item container alignItems="center" className={classes.infoCont}>
          {userPosts.map((post) => (
            <Grid item container alignItems="center">
              <Grid item>
                <Typography>{post.title}</Typography>
              </Grid>
              <Grid item>
                <Typography>Created By:</Typography>
                <Typography>{user.firstName}</Typography>
              </Grid>
              <img
                src={rect}
                alt="rectangle with shadows"
                className={classes.shadowRectangle}
              />
            </Grid>
          ))}
          {/* <Grid>{userPosts[0]?.title}</Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}
