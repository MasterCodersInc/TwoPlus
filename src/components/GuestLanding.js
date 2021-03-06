import React from "react";
import Lottie from "react-lottie";

import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import cafe from "../assets/together.svg";
import chart from "../assets/chart.svg";
import nerd from "../assets/nerd.svg";
import text1 from "../assets/textBlock1.svg";
import text2 from "../assets/textBlock2.svg";
import text3 from "../assets/textBlock3.svg";
import codeWindow from "../assets/codeWindow.json";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.common.colorOne,
    color: "#fff",
    fontFamily: "Montserrat",
    marginTop: "4em",
  },
  headerText: {
    marginLeft: "2em",
  },
}));

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: codeWindow,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function GuestLanding() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Grid
      container
      direction="column"
      style={{ width: "85%", marginLeft: "8em" }}
    >
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        classname={classes.headerText}
      >
        <Grid item>
          <Lottie
            options={defaultOptions}
            alignSelf="left"
            style={{ width: "20em" }}
          />
        </Grid>
        <Typography variant="h1">Welcome to Two+</Typography>
        <Typography variant="body1" style={{ marginTop: "2em" }}>
          Where Developers Get Social
        </Typography>
        <Button
          component={Link}
          to="/signup"
          justify="center"
          classes={{ root: classes.button }}
        >
          SIGN UP FOR FREE
        </Button>
      </Grid>
      <Grid item container style={{ marginTop: "8em" }}>
        <Grid item container direction="column" lg>
          <img src={cafe} alt="two people drinking at cafe" />
          <img src={text1} alt="block of text" />
        </Grid>
        <Grid item container direction="column" lg>
          <img src={chart} alt="two people drinking at cafe" />
          <img src={text2} alt="block of text" />
        </Grid>
        <Grid item container direction="column" lg>
          <img src={nerd} alt="two people drinking at cafe" />
          <img src={text3} alt="block of text" />
        </Grid>
      </Grid>
    </Grid>
  );
}
