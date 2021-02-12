// import React, { useState, useEffect } from 'react';
// import firebase from '../firebase';
// import ChatMsg from './ChatMsg';
// import { useAuth } from '../contexts/AuthContext';
// // this display's  the chat message.. and input field to allow user to send message

// const ChatRoom = ({ postId, postRef, disabled}) => {
//   const { currentUser } = useAuth();
//   const db = firebase.firestore();
//   const { uid } = currentUser;

//   const [messages, setMessage] = useState([]);
//   const [newMessage, setNewMessage] = useState('');

//   //Order and limit data
//   //By default, a query retrieves all documents that satisfy the query in ascending order by document ID. You can specify the sort order for your data using orderBy(), and you can limit the number of documents retrieved using limit().

//   // .collection('posts')
//   // .orderBy("createdAt")
//   // .limit(50)
//   useEffect(() => {
//     if (db) {
//       // console.log('this is db', db)
//       const unsubscribe = postRef
//         .collection('messages')
//         .orderBy('createdAt')
//         .limit(50)
//         .onSnapshot((querySnapshot) => {
//           // get all documents from collection - with ids
//           const data = querySnapshot.docs.map((doc) => ({
//             ...doc.data(),
//             id: doc.id,
//           }));
//           //then update the state
//           setMessage(data);
//         });

//       //detach listener
//       return unsubscribe;
//     }
//   }, [db]);

//   const handleOnChange = (e) => {
//     setNewMessage(e.target.value);
//   };

//   const handleOnSubmit = (e) => {
//     e.preventDefault();

//     //missing userID
//     if (db) {
//       // Add new message in Firestore
//       postRef.collection('messages').add({
//         text: newMessage,
//         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//         uid,
//       });
//     }
//   };

//   return (
//     <div>
//       <ul>
//         {messages.map((message) => (
//             <li key={message.id}>
//               <ChatMsg message={message} currentUserId={uid} />
//             </li>
//           ))}
//       </ul>
//       <div className="mb-6 mx-4">
//         <form onSubmit={handleOnSubmit}>
//           <input
//             type="text"
//             value={newMessage}
//             onChange={handleOnChange}
//             placeholder="Type your message here..."
//           />
//           <button type="submit" disabled={!newMessage || disabled}>
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

import React, { useState, useEffect, useRef } from 'react';
import firebase from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import { formatRelative } from 'date-fns';
import { useParams, useHistory } from 'react-router-dom';
import MessageIcon from '@material-ui/icons/Message';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh',
  },
  headBG: {
    backgroundColor: '#e0e0e0',
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto',
  },
});
const formatDate = (date) => {
  let formattedDate = '';
  if (date) {
    formattedDate = formatRelative(date, new Date());
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};
const ChatRoom = ({ postId, postRef, disabled }) => {
  const { userID } = useParams();
  const classes = useStyles();
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const { uid } = currentUser;

  const [messages, setMessage] = useState([]);
  const [isSent, setIsSent] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatOwner, setChatOwner] = useState({});
  useEffect(() => {
    if (db) {
      const unsubscribe = postRef
        .collection('messages')
        .orderBy('createdAt')
        .limit(50)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessage(data);
        });
        const lastMessageSender = async () => {
          const userName = await firebase
            .firestore()
            .collection('users')
            .where('uid', '==', messages[messages.length - 1].uid)
            .get()
            .then((objUserData) => {
              let indivData = objUserData.docs.map((doc) => ({ ...doc.data() }
              
              ));
              console.log('undividual', indivData[0])
              setChatOwner(indivData[0]);
            });
        };
        lastMessageSender();
      return unsubscribe
    }
  }, [isSent]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    //missing userID
    if (db) {
      // Add new message in Firestore
      postRef.collection('messages').add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
      });
    }
    setIsSent(true);
  };
  console.log('who is chat owner', messages)

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <MessageIcon> {chatOwner.userName}</MessageIcon>
            <Typography variant="h5" className="header-message">
              {chatOwner.userName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs="auto">
          <List className={classes.messageArea}>
            {messages.map((message) =>
              message.uid === uid ? (
                <ListItem key={`${message.id}`}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        align="right"
                        primary={message.text}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        color="secondary"
                        align="right"
                        secondary={`${formatDate(new Date().now)} ${
                          chatOwner.userName
                        }`}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              ) : (
                <ListItem key="2">
                  <Grid container>
                    <Grid item xs={100}>
                      <ListItemText
                        color="primary"
                        align="left"
                        primary={message.text}
                        backgroundColor
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        secondary={`${formatDate(new Date())} ${
                          chatOwner.userName
                        } ${chatOwner.userName}`}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <Grid container style={{ padding: '10px' }}>
            <form onSubmit={handleOnSubmit} type="submit">
              <TextField
                value={newMessage}
                onChange={handleOnChange}
                fullWidth
              />
              <Divider />
              <Button
                type="submit"
                color="primary"
                align="left"
                disabled={!newMessage || disabled}
              >
                send
              </Button>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default ChatRoom;
