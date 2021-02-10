import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Typography, ListItem } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { WhereToVote } from "@material-ui/icons";
import firebase from "../firebase";

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
}));

//expects a "documentRef" prop so that the upvote goes to the right place
//expects a "documentData" prop to render number correctly
const PlusPlusButton = ({ documentData, documentRef }) => {
  const { postID } = useParams();
  const { currentUser, firestoreUser } = useAuth();

  const classes = useStyles();
  const theme = useTheme();

  const plusPlusRef = React.useRef();

  const [buttonState, setButtonState] = React.useState(true);
  const [plusplusCount, setPlusplusCount] = React.useState(
    documentData.plusplusCount
  );

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  const arrayRemove = firebase.firestore.FieldValue.arrayRemove;

  useEffect(() => {
    if (documentData.plusplusList.includes(currentUser.uid)) {
      setButtonState(false);
    }
  }, []);

  async function upvoteHandler() {
    if (!buttonState) {
      setPlusplusCount(plusplusCount - 1);
      setButtonState(true);
      await documentRef.update({ plusplusList: arrayRemove(currentUser.uid) });
      await documentRef.update({ plusplusCount: plusplusCount - 1 });
    }
    if (buttonState) {
      setPlusplusCount(plusplusCount + 1);
      setButtonState(false);

      await documentRef.update({ plusplusList: arrayUnion(firestoreUser.uid) });
      await documentRef.update({ plusplusCount: plusplusCount + 1 });
    }
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
