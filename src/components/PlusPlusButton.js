import React, { useRef, useState } from "react";
import { TextField, Button, Typography, ListItem } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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

//expects a "document" prop so that the upvote goes to the right place
const PlusPlusButton = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const plusPlusRef = React.useRef();
  const [buttonState, setButtonState] = React.useState(true);

  function upvoteHandler(document) {
    setButtonState(!buttonState);
    document.update({ plusplusCount: document.data().plusplusCount + 1 });
  }

  return (
    <Button
      ref={plusPlusRef}
      onClick={() => {
        upvoteHandler(props.document);
      }}
      classes={
        buttonState ? { root: classes.unpressed } : { root: classes.pressed }
      }
    >
      ++
    </Button>
  );
};

export default PlusPlusButton;
