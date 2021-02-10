import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import "firebase/storage";
import PlusPlusButton from "./PlusPlusButton";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TextField, Button, Typography, ListItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  form: {
    align: "center",
    textAlign: "center",
  },
  button1: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    marginTop: "1em",
    fontFamily: "Montserrat",
    width: "8em",
  },
  initialPost: {
    background: theme.palette.common.colorTwo,
    padding: ".6em",
    marginBottom: "1em",
  },
  replyField: {
    background: theme.palette.common.white,
    width: "75%",
    paddingTop: "1em",
  },

  responses: {
    background: theme.palette.common.colorFive,
    marginTop: "1em",
  },
  tagItem: {
    fontFamily: "Montserrat",
    justifyContent: "space-between",
    alignItems: "center",
    align: "center",
    textAlign: "center",
    background: "#5B56E9",
    borderRadius: "2px",
    color: "#ffffff",
    marginLeft: 0,
    marginRight: 5,
    marginTop: 5,
    padding: "5px",
    width: "fit-content",
  },
}));

const DiscussPost = ({ post }) => {
  const { currentUser, firestoreUser } = useAuth();
  const { postId } = useParams();
  const theme = useTheme();
  const classes = useStyles();
  const [responsesRef, setResponsesRef] = React.useState();
  const [actualPostRef, setActualPostRef] = React.useState();
  const [actualPostData, setActualPostData] = React.useState();
  const [responses, setResponses] = React.useState();
  const [replyText, setReplyText] = React.useState();
  const [postImage, setPostImage] = React.useState();

  useEffect(() => {
    async function fetchPostAndReplies() {
      setResponsesRef(
        firebase
          .firestore()
          .collection("posts")
          .doc(`${postId}`)
          .collection("discussReplies")
      );
      const postRef = firebase.firestore().collection("posts").doc(`${postId}`);
      setActualPostRef(postRef);

      const postData = await postRef.get();
      setActualPostData(postData.data());
    }

    fetchPostAndReplies();
  }, []);

  useEffect(() => {
    if (responsesRef) {
      responsesRef.orderBy("timestamp").onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return { doc: doc.data() };
        });
        setResponses(data);
      });
    }
  }, [responsesRef]);

  const onReplyHandler = () => {
    responsesRef.add({
      content: replyText,
      userRef: currentUser.uid,
      userName: firestoreUser.userName,
      timestamp: Date.now(),
    });
    setReplyText("");
  };

  return (
    <Grid
      id="pageContainer"
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <div
        id="postAndPlus"
        style={{ display: "flex", flexDirection: "row", width: "75%" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: 10,
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          {actualPostData && (
            <PlusPlusButton
              documentRef={actualPostRef}
              documentData={actualPostData}
            />
          )}
        </div>

        <div
          style={{
            backgroundColor: theme.palette.common.colorTwo,
            padding: 10,
            marginBottom: 10,
            width: "100%",
            borderRadius: 5,
          }}
        >
          <Typography style={{ marginTop: 5, marginBottom: 2 }} variant="h2">
            {post.title}
          </Typography>
          {post.imageURL && (
            <img style={{ width: 300, height: 300 }} src={post.imageURL} />
          )}
          <Typography variant="body2">{post.description}</Typography>
          <div style={{ display: "flex" }}>
            {post.tags.map((tag, idx) => {
              return (
                <ListItem key={idx} className={classes.tagItem}>
                  {tag}
                </ListItem>
              );
            })}
          </div>
          {actualPostData && (
            <Typography
              component={Link}
              to={`/users/${actualPostData.userRef}`}
              variant="subtitle1"
              style={{ marginTop: "1em" }}
            >
              Asked by: {actualPostData?.userName}
            </Typography>
          )}
        </div>
      </div>
      {responses && (
        <Grid item alignContent="center">
          {responses.map((response) => {
            return (
              <Grid
                item
                style={{
                  backgroundColor: "#F8F8F8",
                  boxShadow: "6px 4px 5px -2px rgba(136,157,226,0.25)",
                  width: "75vw",
                  padding: 10,
                  paddingTop: 0,
                  borderRadius: 5,
                  marginBottom: 15,
                  marginTop: 15,
                }}
              >
                <Typography
                  variant="body1"
                  style={{ paddingTop: ".2em", marginBottom: ".2em" }}
                >
                  {response.doc.content}
                </Typography>
                <Typography variant="body2">
                  Author:{response.doc.userName}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Grid container classes={{ root: classes.replyField }}>
        <TextField
          fullWidth
          placeholder="Type your response here..."
          width="100%"
          multiline
          rows={5}
          variant="filled"
          value={replyText}
          onChange={(e) => {
            setReplyText(e.target.value);
          }}
        ></TextField>
        <Button classes={{ root: classes.button1 }} onClick={onReplyHandler}>
          Reply
        </Button>
      </Grid>
    </Grid>
  );
};

export default DiscussPost;
