// import React, { useState, useEffect } from 'react';
// import firebase from '../firebase';
// import { useAuth } from '../contexts/AuthContext';
// import { useParams, useHistory } from 'react-router-dom';

// {/* <Route exact path="/users/:userID" component={PublicProfile} /> */}
// const UserFollowing = () => {
//   const db = firebase.firestore();
//   const { currentUser } = useAuth();
//   const followersRef = db.collection('followers');
//   const followingRef = db.collection('following');
//   const [userFollowers, setUserFollowers] = useState([]);
//   const [userFollowing, setUserFollowing] = useState([]);
// useEffect(() => {
//   const getUserFollowingsFunc = async () => {
//     const getUserFollowings = await followingRef
//       .doc(currentUser.uid)
//       .collection('userFollowing')
//       .onSnapshot((queryFollowingSnapShot) => {
//         const userFollowingData = queryFollowingSnapShot.docs.map((doc) => ({
//           ...doc.data(),
//         }));
//         console.log(
//           'what user following',
//           userFollowingData[0].userFollowing
//         );
//         setUserFollowing(userFollowingData[0].userFollowing);
//       });
//   };
//   getUserFollowingsFunc();
// }, [])

//   const clickToUserProfilePage = (e) => {
//     alert('users profile page');
//   };
//   return (
//     <div>
//       {userFollowing.map((item) => {
//         console.log('whats user')
//         return (
//           <ul>
//             <li onClick={clickToUserProfilePage}>{`${item}`}</li>
//           </ul>
//         );
//       })}
//     </div>
//   );
// };

// export default UserFollowing;

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
  const classes = useStyles();
  const { userID } = useParams();
  const db = firebase.firestore();
  const { currentUser } = useAuth();
  const followersRef = db.collection('followers');
  const followingRef = db.collection('following');
  const [userFollowing, setUserFollowing] = useState([]);
  const [followedList, setFollowedList] = useState();
  console.log('this is current users hhhh', currentUser.uid);
  useEffect(() => {
    const getUserFollowingsFunc = async () => {
      const getUserFollowings = await followingRef
        .doc(currentUser.uid)
        .collection('userFollowing')
        .onSnapshot((queryFollowingSnapShot) => {
          const userFollowingData = queryFollowingSnapShot.docs.map((doc) => ({
            ...doc.data(),
          }));
          const usefFollowerListInfo = userFollowingData[0].userFollowing.map(
            async (item) => {
              const personObjData = await firebase
                .firestore()
                .collection('users')
                .where('uid', '==', item);
              console.log('this is item', item);
              personObjData.get().then((obj) => {
                obj.docs.forEach((doc) => {
                  setFollowedList({ ...doc.data(), id: doc.id });
                });
              });
            }
          );
        });
    };
    getUserFollowingsFunc();
  }, []);

  console.log('be it', followedList);
  return (
    <div>
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText
            primary={`${followedList.firstName} ${followedList.lastName}`}
          />
        </ListItem>
      </List>
    </div>
  );
}
