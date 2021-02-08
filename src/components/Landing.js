import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import addButt from "../assets/addButt.svg";
import postRec from "../assets/postRec.svg";

export default function Landing() {
  const { currentUser } = useAuth();
  const history = useHistory();
  if (currentUser) {
    history.push("/userhome");
  } else {
    history.push("/guesthome");
  }
  return(
    <div></div>
  )
}
