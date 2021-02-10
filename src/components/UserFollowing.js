import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useHistory } from 'react-router-dom';

{/* <Route exact path="/users/:userID" component={PublicProfile} /> */}
const UserFollowing = () => {
  const db = firebase.firestore();
  const { currentUser } = useAuth();
  const followersRef = db.collection('followers');
  const followingRef = db.collection('following');
  const [userFollowers, setUserFollowers] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
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
}, [])

  const clickToUserProfilePage = (e) => {
    alert('users profile page');
  };
  return (
    <div>
      {userFollowing.map((item) => {
        console.log('whats user')
        return (
          <ul>
            <li onClick={clickToUserProfilePage}>{`${item}`}</li>
          </ul>
        );
      })}
    </div>
  );
};

export default UserFollowing;
