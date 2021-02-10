import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/UpdateProfile';
import { useParams, useHistory } from 'react-router-dom';
const UserFollowers = () => {
  const db = firebase.firestore();
  const { userID } = useParams();
  const { currentUser } = useAuth();
  const followersRef = db.collection('followers');
  const followingRef = db.collection('following');
  const [userFollowers, setUserFollowers] = useState([]);
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

  const clickToUserProfilePage = (e) => {
    return <UserProfile />;
  };
  console.log('this is currentUser email', currentUser.email);
  return (
    <div>
      {userFollowers.map((user) => {
        return (
          <ul>
            <li onClick={clickToUserProfilePage}>{currentUser.user} </li>
          </ul>
        );
      })}
    </div>
  );
};

export default UserFollowers;
