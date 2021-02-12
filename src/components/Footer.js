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
  linkedIn: {
    marginLeft: ".8em",
    marginRight: ".8em",
    textDecoration: "none",
    marginTop: "-8em",
    color: theme.palette.common.colorFour,
    fontSize: ".8em",
    "&:hover": {
      color: theme.palette.common.colorThree,
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Grid container className={classes.container}>
      <Grid container alignItems="center" justify="center">
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
      <Grid
        container
        alignItems="center"
        justify="center"
        style={{ marginTop: "-4em" }}
      >
        <Grid item>
          <Typography
            component="a"
            href="https://www.linkedin.com/in/kirstierodriguez/"
            rel="noopener noreferrer"
            target="_blank"
            variant="body1"
            className={classes.linkedIn}
          >
            Kirstie Rodriguez
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            component="a"
            href="https://www.linkedin.com/in/joetoenails/"
            rel="noopener noreferrer"
            target="_blank"
            variant="body1"
            className={classes.linkedIn}
          >
            Joe Tonelli
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            component="a"
            href="https://www.linkedin.com/in/lindsey-pak-babaaa12b/"
            rel="noopener noreferrer"
            target="_blank"
            variant="body1"
            className={classes.linkedIn}
          >
            Lindsey Pak
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            component="a"
            href="https://www.linkedin.com/in/mati-dejene/"
            rel="noopener noreferrer"
            target="_blank"
            variant="body1"
            className={classes.linkedIn}
          >
            Sintayehu Dejene
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
