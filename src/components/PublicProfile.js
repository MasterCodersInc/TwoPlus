import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import firebase from '../firebase';
import { useParams, useHistory } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import rect from '../assets/userACCrec.svg';
import UserFollowing from './UserFollowing';
import UserFollowers from './UserFollowers';
import { id } from 'date-fns/locale';

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: 'absolute',
    zIndex: -1,
  },
  tabs: {
    marginLeft: '5em',
    marginTop: '3em',
  },
  tab: {
    textTransform: 'none',
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: theme.palette.common.colorTwo,
  },
  infoCont: {
    marginTop: '8em',
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

export default function PublicProfile() {
  const history = useHistory();
  const { userID } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const [user, setUser] = useState({});
  const [userPostList, setUserPostList] = useState(null);
  const db = firebase.firestore();

  //---

  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const followersRef = db.collection('followers');
  const followingRef = db.collection('following');
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  console.log('who is current ', currentUser.uid, 'pram user', userID);

  useEffect(() => {
    async function getUserAndPosts() {
      const userObjLoc = await firebase
        .firestore()
        .collection('users')
        .where('uid', '==', userID);
      let userData = await userObjLoc.get();
      userData = userData.docs[0].data();
      setUser(userData);
      const postRefs = db
        .collection('posts')
        .where('userRef', '==', userData.uid);

      let postsArr = await postRefs.get();
      postsArr = postsArr.docs.map((doc) => ({ ...doc.data(), docID: doc.id }));
      setUserPostList(postsArr);
    }
    getUserAndPosts();
  }, []);

  // const createNewUsersFollowweAndFollowingCollection = async () => {
  //   if (
  //     currentUser.uid &&
  //     userFollowing.length === 0 &&
  //     currentUser.uid &&
  //     userFollowers.length === 0
  //   ) {

  //   } else {
  //     console.log('u hav an account');
  //   }
  //   // console.log('this is whats in data', data[0].id, data[0].id.map((el) => el === userID))
  // };
  // createNewUsersFollowweAndFollowingCollection();

  useEffect(() => {
    const getUserFollowingsFunc = async () => {
      const getUserFollowings = await followingRef
        .doc(currentUser.uid)
        .collection('userFollowing')
        .onSnapshot((queryFollowingSnapShot) => {
          const userFollowingData = queryFollowingSnapShot.docs.map((doc) => ({
            ...doc.data(),
          }));
          console.log(
            'what user following',
            userFollowingData[0].userFollowing
          );
          setUserFollowing(userFollowingData[0].userFollowing);
        });
    };
    getUserFollowingsFunc();
  }, []);
  useEffect(() => {
    const getUserFollowersFunc = async () => {
      const getUserFollowers = await followersRef
        .doc(currentUser.uid)
        .collection('userFollowers')
        .onSnapshot((queryFollowingSnapShot) => {
          const userFollowersData = queryFollowingSnapShot.docs.map((doc) => ({
            ...doc.data(),
          }));
          console.log(
            'what user followers',
            userFollowersData[0].userFollowers
          );
          setUserFollowers(userFollowersData[0].userFollowers);
        });
    };
    getUserFollowersFunc();
  }, []);

  // ===>
  const followUser = async (e) => {
    const updateFollowingData = await followingRef
      .doc(currentUser.uid)
      .collection('userFollowing')
      .doc(currentUser.uid)
      .update({
        userFollowing: firebase.firestore.FieldValue.arrayUnion(userID), // I used update to avoid to prevent it from adding same user twice
      });
    const updateFollowedUserFollowingData = await followersRef
      .doc(userID)
      .collection('userFollowers')
      .doc(userID)
      .update({
        userFollowers: firebase.firestore.FieldValue.arrayUnion(
          currentUser.uid
        ),
      });
  };

  const clickToUserProfilePage = (e) => {
    history.push(`/users/${currentUser.uid}`);
  };

  const handleUnfollowUser = async (e) => {
    await followingRef
      .doc(currentUser.uid)
      .collection('userFollowing')
      .doc(currentUser.uid)
      .update({
        userFollowing: firebase.firestore.FieldValue.arrayRemove(userID),
      });

    // const getData = followingRef
    //   .doc(currentUser.uid)
    //   .collection('userFollowing')
    //   .onSnapshot((queryFollowingSnapShot) => {
    //     const userFollowingData = queryFollowingSnapShot.docs.map((doc) => ({
    //       ...doc.data(),
    //     }));
    //     if (userFollowingData[0].id.forEach((el) => el === userID)) {
    //       setIsFollowing(false);

    //       // setUserFollowing([userFollowingData]);
    //     } else {
    //       console.log(
    //         "this user doesn't seem to be found in your followers list"
    //       );
    //     }
    //   });
  };

  const followAndUnfollowClickHandler = (e) => {
    if (!isFollowing && currentUser.uid !== userID) {
      followUser();
      setIsFollowing(true);
    } else if (isFollowing && currentUser.uid !== userID) {
      handleUnfollowUser();
      setIsFollowing(false);
    } else if (currentUser.uid === userID) {
      clickToUserProfilePage();
    }
  };

  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item style={{ marginLeft: '5em' }}>
          <Typography variant="h1" style={{ marginBottom: '.25em' }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Grid item container direction="row">
            <img
              style={{
                width: 150,
                height: 150,
                borderRadius: 20,
                border: '2px solid #F8F8F8',
              }}
              src="https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"
            />
            <Grid item>
              <Tabs>
                <Tab
                  label={user.firstName + "'s posts"}
                  className={classes.tab}
                />
                <Button onClick={followAndUnfollowClickHandler}>
                  {currentUser.uid === userID
                    ? 'edit'
                    : isFollowing === false
                    ? 'Follow'
                    : 'Unfollow'}
                </Button>
                <Button
                  component={Link}
                  to="/userFollowers"
                  onClick={() => {
                    <UserFollowers />;
                  }}
                >
                  {`Followers ${userFollowers.length}`}
                </Button>
                <Button
                  component={Link}
                  to="/userFollowings"
                  onClick={() => {
                    <UserFollowing />;
                  }}
                >
                  {`Following ${userFollowing.length}`}
                </Button>
              </Tabs>
              <Grid container id="postsContainer">
                {userPostList &&
                  userPostList.map((post) => {
                    return (
                      <div
                        style={{
                          marginLeft: '2em',
                          backgroundColor: '#F8F8F8',
                          boxShadow: '6px 7px 12px 1px rgba(136,157,226,0.39)',
                          width: '60vw',
                          padding: 10,
                          paddingTop: 0,
                          borderRadius: 10,
                          marginBottom: 15,
                        }}
                      >
                        <Typography
                          component={Link}
                          style={{ textDecoration: 'none', color: '#5B56E9' }}
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
