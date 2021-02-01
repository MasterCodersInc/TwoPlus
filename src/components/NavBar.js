import React from "react";

import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import logo from "../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "4em",
  },
  appBar: {
    backgroundColor: "#fff",
    height: "5em",
  },
  toolbar: {
    marginLeft: "4em",
    marginTop: ".5em",
  },
  tab: {
    color: theme.palette.common.colorOne,
    fontWeight: 600,
    fontFamily: "Montserrat",
    fontSize: ".8em",
    textTransform: "none",
    padding: 0,
    width: "3em",
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters className={classes.toolbar}>
          <Grid item>
            <img src={logo} alt="2+" style={{ width: "3em" }} />
          </Grid>
          <Grid
            item
            container
            justify="flex-end"
            style={{ marginRight: "4em" }}
          >
            <Tabs>
              <Tab
                component={Link}
                to="/login"
                label="Sign In"
                className={classes.tab}
              />
              <Tab
                component={Link}
                to="/signup"
                label="Sign Up"
                className={classes.tab}
              />
              <Tab
                component={Link}
                to="/editor"
                label="Editor"
                className={classes.tab}
              />
            </Tabs>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </React.Fragment>
  );
}
