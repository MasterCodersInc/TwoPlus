import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import UserFollowing from './UserFollowing';
import UserFollowers from './UserFollowers';

const AllUsersIn2Plus = () => {
  const db = firebase.firestore();
  const { currentUser } = useAuth();

  const [allUsers, setAllUsers] = useState([]);
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [followingStatus, setfollowingStatus] = useState(false);
  console.log('this is following status', followingStatus);
  useEffect(() => {
    const getUsers = async () => {
      const response = await db.collection('users').get();
      const userData = response.docs.map((user) => {
        return user.data();
      });
      setAllUsers(userData);
    };
    getUsers();
  }, []);
  // const followingStatusHandler =() => {
  //     setfollowingStatus(true)
  // }
  // const incermentFollowerHandler =() => {
  //     setFollowers(followers + 1)
  // }
  const follow = 'Follow';
  const unFollow = 'Unfollow';

  return (
    <div>
      <Button
        component={Link}
        to="/userFollowings"
        onClick={() => {
          <UserFollowing />;
        }}
      >
        Following {following}
      </Button>
      <Button
        component={Link}
        to="/userFollowers"
        onClick={() => {
          <UserFollowers />;
        }}
      >
        Followers {followers}
      </Button>
      <h1>Two Plus Users</h1>
      <div>
        {allUsers.map((user) => {
          return (
            <ul>
              <li
                onClick={() => {
                  alert(`${user.email} was clicked`);
                }}
              >
                {user.email}{' '}
              </li>
              <div>
                {' '}
                <Button
                  onClick={() => {
                    setFollowing(following + 1);
                    setfollowingStatus(!followingStatus);
                  }}
                >
                  {!followingStatus ? follow : unFollow}
                </Button>
              </div>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default AllUsersIn2Plus;
