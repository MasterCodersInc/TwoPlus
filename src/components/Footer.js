import React from "react";

import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import logo from "../assets/logo.png";
import line from "../assets/line.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "15em",
    backgroundColor: theme.palette.common.colorFive,
    marginTop: "8em",
  },
  logo: {
    width: "8em",
    height: "8em",
    //     marginLeft: "1em",
  },
  navLink: {
    color: theme.palette.common.colorThree,
    marginLeft: "1.5em",
    marginRight: "1.5em",
    fontSize: ".7em",
  },
}));

export default function Footer() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <Grid item style={{ marginRight: "1em" }}>
        <img src={line} alt="line" />
      </Grid>
      <Grid item>
        <Typography className={classes.navLink}>HOME</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.navLink}>ACCOUNT</Typography>
      </Grid>
      <Grid item>
        <img src={logo} alt="two plus logo" className={classes.logo} />
      </Grid>
      <Grid item>
        <Typography className={classes.navLink}>FAQ</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.navLink}>CONTACT</Typography>
      </Grid>
      <Grid item style={{ marginLeft: "1em" }}>
        <img src={line} alt="line" />
      </Grid>
    </Grid>
  );
}
