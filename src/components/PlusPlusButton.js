import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Typography, ListItem } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useAuth } from "../contexts/AuthContext";

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
  const { currentUser, firestoreUser } = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const plusPlusRef = React.useRef();
  const [buttonState, setButtonState] = React.useState(true);
  const [plusplusCount, setPlusplusCount] = React.useState(
    documentData.plusplusCount
  );

  async function upvoteHandler() {
    setButtonState(!buttonState);
    setPlusplusCount(plusplusCount + 1);
    await documentRef.collection("plusplusList").add({
      userRef: currentUser.uid,
      userName: firestoreUser.userName,
      timestamp: Date.now(),
    });
    await documentRef.update({ plusplusCount: plusplusCount + 1 });
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
