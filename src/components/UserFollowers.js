import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useHistory } from 'react-router-dom';
import { ListItemIcon, Grid } from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function UserFollowing() {
  const db = firebase.firestore();
  const { currentUser } = useAuth();
  const followersRef = db.collection('followers');
  const [userFollowersId, setUserFollowers] = useState([]);
  //listing
  const [followersData, setfollowersData] = useState({});
  // console.log('console hello  blah blah blah',  followersRef.doc(currentUser.uid).collection('userFollowers').doc(currentUser.uid).collection(currentUser.uid).get())
  console.log('who is current user tell me now!!', currentUser.uid)
  useEffect(() => {
    const getUserFollowersFunc = async () => {
      const getUserFollowersRef = await followersRef
        .doc(currentUser.uid)
        .collection('userFollowers')
        .onSnapshot((queryFollowingSnapShot) => {
          const userFollowersId = queryFollowingSnapShot.docs.map((doc) => ({
            ...doc.data(),
          }));
     
          console.log('current user ref is what 00000', userFollowersId[0].userFollowers.map((item) => {
            console.log('people, people, people', item)
          }))
          setUserFollowers(userFollowersId[0].userFollowers);
        });
    };
    getUserFollowersFunc();
  }, []);
 
  useEffect( () => {
    const getUserFollowersData = async () => {
      await userFollowersId.map(async (personId) => {
        const userObjLoc = await firebase
          .firestore()
          .collection('users')
          .where('uid', '==', personId);
        let personData = userObjLoc.get().then((objData) => {
          let dataData = objData.docs.map((doc) => ({
            // setfollowersData( {
              ...doc.data(),
              id: doc.id
            // });
          }));
          console.log('please let it be', dataData)
          setfollowersData(dataData)
        });
      });
      console.log('this do i get called found');
    };
    console.log('come on now do.......');
    getUserFollowersData();
    console.log('this do i get called also');
  }, []);


  //dataData[0].id.map((el) => (console.log("this is el"el"))
  const onClick = (e) => {
    e.preventDefault(e)
    alert('hello')
  }
  return (
    <div>
      <List component="nav" aria-label="secondary mailbox folders" key={followersData.id}>
        <ListItem button  onClick={onClick}>
          <ListItemText
            primary={`hello there, ${followersData.firstName} ${followersData.id} ${followersData.lastName}`}
          />
        </ListItem>
      </List>
    </div>
  );
}
