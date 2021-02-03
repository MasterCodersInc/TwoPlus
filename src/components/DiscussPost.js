import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";

import { TextField, Button, Typography } from "@material-ui/core";
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
    width: "75%",
    padding: "1em",
  },
  replyField: {
    background: theme.palette.common.white,
    width: "75%",
    paddingTop: "1em",
  },
  responses: {
    background: theme.palette.common.colorFive,
    width: "75%",
    marginTop: "1em",
  },
}));

const DiscussPost = ({ post }) => {
  const { currentUser } = useAuth();
  const { postId } = useParams();
  const theme = useTheme();
  const classes = useStyles();
  const [responses, setResponses] = React.useState();
  const [responsesRef, setResponsesRef] = React.useState();

  useEffect(() => {
    async function fetchPostReplies() {
      setResponsesRef(
        firebase
          .firestore()
          .collection("posts")
          .doc(`${postId}`)
          .collection("discussReplies")
      );
    }
    fetchPostReplies();
  }, []);

  useEffect(() => {
    if (responsesRef) {
      responsesRef.onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return { doc: doc.data() };
        });
        setResponses(data);
      });
    }
  }, [responsesRef]);

  const onReplyHandler = () => {
    responsesRef.add({
      content: "Very cool question! I can't help",
      userRef: currentUser.uid,
      timestamp: Date.now(),
    });
  };
  console.log(responses);
  console.log(responsesRef);
  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid classes={{ root: classes.initialPost }} item>
        <Typography style={{ marginTop: 5 }} variant="h2">
          {post.title}
        </Typography>
        <Typography variant="body2">{post.description}</Typography>
        <Typography variant="subtitle1" style={{ marginTop: "1em" }}>
          Asked by: {currentUser.email}
        </Typography>
      </Grid>
      <Grid container classes={{ root: classes.responses }}>
        {responses && (
          <div>
            {responses.map((response) => {
              return <h4>{response.doc.content}</h4>;
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
        ></TextField>
        <Button classes={{ root: classes.button1 }} onClick={onReplyHandler}>
          Reply
        </Button>
      </Grid>
    </Grid>
  );
};

export default DiscussPost;
