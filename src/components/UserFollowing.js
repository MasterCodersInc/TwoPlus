import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useHistory } from 'react-router-dom';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { Toolbar, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
// import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: 'absolute',
    zIndex: -1,
  },
  tabs: {
    marginLeft: '3em',
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
  },
  infoText: {
    marginLeft: '5em',
  },
  followButton: {
    color: '#fff',
    backgroundColor: theme.palette.common.colorOne,
    fontFamily: 'Montserrat',
    padding: '.3em',
    marginLeft: '2em',
    height: 'fit-content',
  },
  searchContainer: {
    display: 'flex',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    paddingLeft: '20px',
    paddingRight: '20px',
    marginTop: '5px',
    marginBottom: '5px',
  },
  searchIcon: {
    alignSelf: 'flex-end',
    marginBottom: '5px',
  },
  searchInput: {
    width: '200px',
    margin: '5px',
  },
}));

const UserFollowing = () => {
  const db = firebase.firestore();
  const { currentUser, firestoreUser } = useAuth();
  const classes = useStyles();

  const [personalData, setPersonalData] = useState({});
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowingList, setUserFollowingList] = useState(null);
  const [filter, setFilter] = useState('');
  useEffect(() => {
    async function getUserFollowing() {
      const userObjLoc = await firebase
        .firestore()
        .collection('users')
        .where('uid', '==', currentUser.uid);
      let userData = await userObjLoc.get();
      let personalData = userData.docs[0];

      setPersonalData({ ...personalData.data(), docId: personalData.id });
      let followingList = [];
      for (const user of personalData.data().following) {
        const followingRef = firebase
          .firestore()
          .collection('users')
          .where('uid', '==', user);
        const followingData = await followingRef.get();

        followingList.push(followingData.docs[0].data());
      }

      setUserFollowingList(followingList);
    }
    getUserFollowing();
  }, []);
  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };
  return (
    <div style={{maxWidth: '95vw', minHeight: '54.5vh'}}>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h1" style={{ marginLeft: "2.3em" }}>
            Welcome, {firestoreUser && firestoreUser.firstName}
          </Typography>
        </Grid>
        <Grid item container className={classes.tabs}>
          <Tabs>
            <Tab label="Your Info" value={false} className={classes.tab} />
            <Tab
              value={false}
              component={Link}
              to="/myposts"
              label="My Posts"
              className={classes.tab}
            />
            <Tab
              value={false}
              component={Link}
              to="/savedcontent"
              label="++Content"
              className={classes.tab}
            />
            <Tab
              value={false}
              component={Link}
              to="/userFollowers"
              label="Followers"
              className={classes.tab}
            />
            <Tab
              value={false}
              component={Link}
              to="/userFollowings"
              label="Following"
              className={classes.tab}
            />
          </Tabs>
        </Grid>
      <Grid item id="postsContainer" style={{marginLeft: '3.2em'}}>
        <Toolbar>
          <div className={classes.searchContainer}>
            <SearchIcon className={classes.searchIcon} />
            <TextField
              className={classes.searchInput}
              label="search...."
              onChange={handleSearchChange}
            />
          </div>
        </Toolbar>
        {userFollowingList &&
          (!userFollowingList.length ? (
            <Typography style={{ marginLeft: '3em' }}>
              This user isn't following anyone.
            </Typography>
          ) : (
            userFollowingList.map((user) => {
              if (user.userName.toUpperCase().includes(filter.toUpperCase())) {
                return (
                  <div
                    style={{
                      marginLeft: '2em',
                      backgroundColor: '#F8F8F8',
                      boxShadow: '5px 5px 9px -3px rgba(136,157,226,0.25)',
                      width: '60vw',
                      padding: 10,
                      paddingTop: 10,
                      borderRadius: 10,
                      marginBottom: 15,
                    }}
                  >
                    <Card className={classes.card}>
                      <CardContent className={classes.content}>
                        <CardMedia className={classes.media}>
                          <img
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: 10,
                              objectFit: 'cover',
                              marginRight: 5,
                            }}
                            src={user.profilePhotoURL}
                          />
                        </CardMedia>
                        <Typography
                          style={{
                            textDecoration: 'none',
                            color: '#5B56E9',
                            marginRight: 10,
                          }}
                          variant="h2"
                        >
                          {user.userName}
                        </Typography>
                        <Typography variant="body2" style={{ marginRight: 10 }}>
                          Followers:{user.followers.length}
                        </Typography>
                        <Typography variant="body2">
                          Following:{user.following.length}
                        </Typography>
                        <Button
                          component={Link}
                          style={{
                            textDecoration: 'none',
                            color: '#5B56E9',
                            marginRight: 10,
                          }}
                          to={`/users/${user.uid}`}
                          variant="h2"
                        >
                          <AccountBoxIcon />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              }
            })
          ))}
      </Grid>
      </Grid>
    </div>
  );
};

export default UserFollowing;
