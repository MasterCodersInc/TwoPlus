import React from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import addButt from "../assets/addButt.svg";
import postRec from "../assets/postRec.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.colorFive,
    marginTop: "-5em",
  },
  popTopCont: {
    marginLeft: "5em",
    width: "30%",
  },
  popTopLi: {
    marginTop: ".5em",
    marginBottom: ".5em",
  },
}));

export default function Landing() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item container style={{ marginTop: "5em" }}>
        <Grid
          item
          container
          direction="column"
          className={classes.popTopCont}
          lg={2}
        >
          <Typography style={{ marginBottom: "1em", marginTop: "4.5em" }}>
            Popular Topics
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #HTML
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #Javascript
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #CSS
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #Python
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #Firebase
          </Typography>
          <Typography variant="body2" className={classes.popTopLi}>
            #React
          </Typography>
        </Grid>
        <Grid item container direction="column" lg>
          <Grid item>
            <Typography variant="h1">Current Questions</Typography>
          </Grid>
          <Grid
            item
            container
            alignItems="center"
            style={{ marginTop: "1em", marginLeft: "-1em" }}
          >
            <Button component={Link} to="/posts/add">
              <img src={addButt} alt="add button" />
            </Button>

            <Typography variant="body1" style={{ marginLeft: "1em" }}>
              Post a New Question
            </Typography>
          </Grid>
          <Grid item container>
            <Grid item style={{ backgroundImage: `url${postRec}` }}></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
