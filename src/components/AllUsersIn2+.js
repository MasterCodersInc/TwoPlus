import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import UserFollowing from './UserFollowing';
import UserFollowers from './UserFollowers';
import UserProfile from '../components/UpdateProfile';
import { useHistory } from 'react-router-dom';

const AllUsersIn2Plus = () => {
  const db = firebase.firestore();
  const { currentUser } = useAuth();
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);
  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [followingStatus, setFollowingStatus] = useState(false);

  

  useEffect(() => {
    const getUsers = async () => {
      const response = await db.collection('users').get();
      console.log('this is response', response);
      const userData = response.docs.map((user) => {
        console.log(
          'this is user data',
          user.data(),
          ' and this is current user',
          currentUser.uid
        );
        return user.data();
      });
      setAllUsers(userData);
    };
    getUsers();
  }, []);

  {
    /* 
  //getting doc id

    followingRef.get()
  .then(snapshot => {
    snapshot.forEach(doc =>  {
      const data = doc.data()
      console.log('this is new data', doc.id, data)
    })
    
  })

  */
  }

  // followingRef.get()
  // .then(snapshot => {
  //   snapshot.forEach(doc =>  {
  //     const data = doc.data()
  //     console.log('this is new data', doc.id, data)
  //   })

  // })

  // console.log('this is annoying', currentUser.uid, followingRef.doc(currentUser.uid).collection('userFollowing').doc(user.id))

  // console.log('thit this is cureent user id', currentUser.uid)

  // console.log('this is second attempt', followingRef.doc(currentUser.uid).collection('userFollowing').doc(`ItkZMhxOdvSTondmT3I8`))

  // const handleFollowUser =()=> {
  //   // make auth user follower of that user (update their followers collection)
  //   followersRef.doc(id).collection('userFollowers').doc(currentUser.uid).setFollowers()

  //   // put that user on your following collection(update your following collection)
  //   followingRef.doc(currentUser.uid).collection('userFollowing').doc(id).setFollowing()
  // }

  // const followingStatusHandler =() => {
  //     setfollowingStatus(true)
  // }
  // const incermentFollowerHandler =() => {
  //     setFollowers(followers + 1)
  // }
  const follow = 'Follow';
  const unFollow = 'Unfollow';

  const clickToUserProfilePage = (e) => {
    history.push('/profile');
  };

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
              <li onClick={clickToUserProfilePage}>{user.email} </li>{' '}
              <Button
                onClick={() => {
                  setFollowing(following + 1);
                  setFollowingStatus(!followingStatus);
                }}
              >
                {!followingStatus ? follow : unFollow}
              </Button>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default AllUsersIn2Plus;
