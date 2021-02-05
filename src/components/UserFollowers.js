import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { useAuth } from '../contexts/AuthContext';
const UserFollowers = () => {
  const db = firebase.firestore();
  const { currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
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
  const clickToUserProfilePage = (e) => {
    alert('users profile page');
  };
  console.log('this is currentUser email', currentUser.email);
  return (
    <div>
      {allUsers.map((user) => {
        return (
          <ul>
            <li onClick={clickToUserProfilePage}>{user.email} </li>
          </ul>
        );
      })}
    </div>
  );
};

export default UserFollowers;
