import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Typography, ListItem } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { PolicyRounded, WhereToVote } from "@material-ui/icons";
import firebase from "../firebase";

import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  unpressed: {
    align: "center",
    textAlign: "center",
    backgroundColor: theme.palette.common.colorOne,
    borderRadius: 50,
    color: "white",
    fontWeight: 1000,
    fontSize: "1.5em",
    padding: 0,
    height: "fit-content",
  },
  pressed: {
    align: "center",
    textAlign: "center",
    backgroundColor: theme.palette.common.colorOne,
    borderRadius: 50,
    color: "white",
    fontWeight: 1000,
    fontSize: "1.5em",
    padding: 0,
    boxShadow: "inset 0 0 10px #000000",
    height: "fit-content",
  },
  unpressed2: {
    align: "center",
    textAlign: "center",
    backgroundColor: theme.palette.common.colorOne,
    borderRadius: 50,
    color: "white",
    fontWeight: 1000,
    fontSize: "1em",
    padding: 0,
    width: "2em",
    minWidth: 0,
  },
  pressed2: {
    align: "center",
    textAlign: "center",
    backgroundColor: theme.palette.common.colorOne,
    borderRadius: 50,
    color: "white",
    fontWeight: 1000,
    fontSize: "1em",
    padding: 0,
    boxShadow: "inset 0 0 10px #000000",
    width: "2em",
    minWidth: 0,
  },
}));

//expects a "documentRef" prop so that the upvote goes to the right place
const PlusPlusButton = ({ documentRef, size }) => {
  const { currentUser, firestoreUser } = useAuth();

  const classes = useStyles();
  const theme = useTheme();

  const plusPlusRef = React.useRef();

  const [buttonState, setButtonState] = React.useState(true);
  const [plusplusCount, setPlusplusCount] = React.useState(0);
  const [postRef, setPostRef] = React.useState();
  const [postData, setPostData] = React.useState();

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

  useEffect(() => {
    async function getPost() {
      let postRef = await firebase
        .firestore()
        .collection("posts")
        .doc(documentRef);
      setPostRef(postRef);
      const postInfo = await postRef.get();
      setPostData(postInfo.data());
    }
    getPost();
  }, []);

  useEffect(() => {
    if (postData) {
      setPlusplusCount(postData.plusplusCount);
      if (!postData.plusplusList) {
        return;
      }
      if (postData.plusplusList.includes(currentUser.uid)) {
        setButtonState(false);
      }
    }
  }, [postData]);

  async function upvoteHandler() {
    if (!buttonState) {
      setPlusplusCount(plusplusCount - 1);
      setButtonState(true);
      await postRef.update({ plusplusList: arrayRemove(currentUser.uid) });
      await postRef.update({ plusplusCount: plusplusCount - 1 });
    }
    if (buttonState) {
      setPlusplusCount(plusplusCount + 1);
      setButtonState(false);

      await postRef.update({ plusplusList: arrayUnion(firestoreUser.uid) });
      await postRef.update({ plusplusCount: plusplusCount + 1 });
    }
  }
  if (size === "small") {
    return (
      <Grid
        item
        container
        alignItems="center"
        justify="flex-end"
        style={{ marginTop: "1em", width: "82%" }}
      >
        <Typography
          style={{ textAlign: "center", marginRight: "5px", fontSize: "1em" }}
          variant="body2"
        >
          {plusplusCount}
        </Typography>
        <Button
          ref={plusPlusRef}
          onClick={upvoteHandler}
          classes={
            buttonState
              ? { root: classes.unpressed2 }
              : { root: classes.pressed2 }
          }
        >
          ++
        </Button>
      </Grid>
    );
  }
  return (
    <div>
      <Typography style={{ textAlign: "center", marginBottom: 5 }} variant="h2">
        {plusplusCount}
      </Typography>
      <Button
        ref={plusPlusRef}
        onClick={upvoteHandler}
        classes={
          buttonState ? { root: classes.unpressed } : { root: classes.pressed }
        }
      >
        ++
      </Button>
    </div>
  );
};

export default PlusPlusButton;
