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

import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import { formatRelative } from "date-fns";
import { useParams, useHistory } from 'react-router-dom';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

const formatDate = (date) => {
  let formattedDate = "";
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
  const uid = currentUser?.uid;

  const [messages, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  console.log("this is new message", newMessage);
  console.log("this is post ref", postRef);
  console.log("current user uid and id", currentUser.uid, currentUser.id);

  useEffect(() => {
    if (db) {
      const unsubscribe = postRef
        .collection("messages")
        .orderBy("createdAt")
        .limit(50)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log("whats data in postRef", data);
          //then update the state
          setMessage(data);
        });
      //detach listener
      return unsubscribe;
    }
  }, [db]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    //missing userID
    if (db) {
      // Add new message in Firestore
      postRef.collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
      });
    }
  };

  return (
<>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary={"currentUser.userName"}></ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Grid item xs={10} style={{padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                <Avatar
                  alt="Remy Sharp"
                  src="https://material-ui.com/static/images/avatar/1.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Remy Sharp">{currentUser.uid.userName}</ListItemText>
              <ListItemText secondary="online" align="right"></ListItemText>
            </ListItem>
            <ListItem button key="Alice">
              <ListItemIcon>
                <Avatar
                  alt="Alice"
                  src="https://material-ui.com/static/images/avatar/3.jpg"
                />
              </ListItemIcon>
              <ListItemText primary="Alice">Alice</ListItemText>
            </ListItem>
            <ListItem button key="CindyBaker">
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={9}>
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
                        align="right"
                        secondary={`${formatDate(
                          new Date(message.createdAt * 1000)
                        )}`}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              ) : (
                <ListItem key="2">
                  <Grid container>
                    <Grid item xs={100}>
                      <ListItemText
                        align="left"
                        primary={message.text}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        secondary={`${formatDate(
                          new Date(message.createdAt * 1000)
                        )}`}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            )}
          </List>
          <Divider />

          <Grid container style={{ padding: "10px" }}>
            <Grid item xs={30}>
              <form type="submit" onSubmit={handleOnSubmit}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  value={newMessage}
                  onChange={handleOnChange}
                  fullWidth
                />
                <Grid xs={1} align="right">
                  <Fab color="primary" aria-label="add">
                    <button color="primary" disabled={!newMessage || disabled}>
                      {" "}
                      send
                    </button>
                  </Fab>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      </>
  );
};

export default ChatRoom;
