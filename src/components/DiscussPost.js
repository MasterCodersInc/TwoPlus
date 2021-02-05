import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import "firebase/storage";
import PlusPlusButton from "./PlusPlusButton";

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
  },
  replyField: {
    background: theme.palette.common.white,
    width: "75vw",
    paddingTop: "1em",
  },
  responseContainer: {
    background: theme.palette.common.white,
    width: "75%",
    marginTop: "1em",
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
  const [responses, setResponses] = React.useState();
  const [replyText, setReplyText] = React.useState();
  const [postImage, setPostImage] = React.useState();

  useEffect(() => {
    async function fetchPostReplies() {
      setResponsesRef(
        firebase
          .firestore()
          .collection("posts")
          .doc(`${postId}`)
          .collection("discussReplies")
      );
      setActualPostRef(
        firebase.firestore().collection("posts").doc(`${postId}`)
      );
    }

    fetchPostReplies();
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
      timestamp: Date.now(),
    });
    setReplyText("");
  };

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      style={{ stroke: "3px solid" }}
    >
      <div
        style={{ display: "flex", flexDirection: "row" }}
        classes={{ root: classes.initialPost }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: 10,
            justifyContent: "center",
          }}
        >
          <Typography
            style={{ textAlign: "center", marginBottom: 5 }}
            variant="h2"
          >
            45
          </Typography>
          <PlusPlusButton document={actualPostRef} />
        </div>
        <Grid
          style={{
            backgroundColor: theme.palette.common.colorTwo,
            padding: 10,
          }}
          item
        >
          <Typography style={{ marginTop: 5, marginBottom: 2 }} variant="h2">
            {post.title}
          </Typography>
          {post.imageURL && (
            <img style={{ width: 300, height: 300 }} src={post.imageURL} />
          )}
          <Typography variant="body2">{post.description}</Typography>
          <Typography variant="subtitle1" style={{ marginTop: "1em" }}>
            Asked by: {firestoreUser.firstName}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }}>
              {post.tags.map((tag, idx) => {
                return (
                  <ListItem key={idx} className={classes.tagItem}>
                    {tag}
                  </ListItem>
                );
              })}
            </div>
          </div>
        </Grid>
      </div>
      <Grid container classes={{ root: classes.responseContainer }}>
        {responses && (
          <div>
            {responses.map((response) => {
              return (
                <Grid classes={{ root: classes.responses }}>
                  <Typography
                    variant="body2"
                    style={{ marginTop: ".6em", marginBottom: ".6em" }}
                  >
                    {response.doc.content}
                  </Typography>
                </Grid>
              );
            })}
          </div>
        )}
      </Grid>
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
