import React, { useState, useEffect } from "react";
import firebase from "../firebase";
// import ChatMsg from './ChatMsg';
import { useAuth } from "../contexts/AuthContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
    height: "50vh",
    overflowY: "auto",
  },
});

const formatDate = (date) => {
  let formattedDate = "";
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

const ChatRoom = ({ postId, postRef, disabled }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser, firestoreUser } = useAuth();
  const db = firebase.firestore();
  const uid = currentUser?.uid;
  const username = firestoreUser?.userName;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (db) {
      // console.log('this is db', db)
      const unsubscribe = postRef
        .collection("messages")
        .orderBy("createdAt")
        .limit(50)
        .onSnapshot((querySnapshot) => {
          // get all documents from collection - with ids
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log("whats data in postRef", data);
          //then update the state
          setMessages(data);
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
        createdAt: Date.now(),
        uid,
        username: username,
      });
    }
    setNewMessage('');
  };

  return (
    <div>
      <Grid container>
        <Grid item>
          <Typography variant="h2" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item style={{ width: "100%" }}>
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
                          new Date(message.createdAt)
                        )}`}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              ) : (
                <ListItem key="2">
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        primary={message.text}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        secondary={`${message.username}`}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align="left"
                        secondary={`${formatDate(
                          new Date(message.createdAt)
                        )}`}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            )}
          </List>
          <Divider />

          <Grid container direction="row" style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <form type="submit" onSubmit={handleOnSubmit} style={{display: 'flex'}}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  value={newMessage}
                  onChange={handleOnChange}
                  multiline
                  rowsMax={4}
                />
                <Grid xs={1} align="right">
                  <Fab 
                    type='submit'
                    color="primary" 
                    aria-label="add" 
                    disabled={!newMessage || disabled} 
                    variant 
                    extended 
                    style={{marginLeft: '1em'}}>
                    Send
                  </Fab>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatRoom;
