import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
  navName: {
    color: theme.palette.common.colorOne,
    fontWeight: 600,
    fontFamily: "Krona One",
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
  const history = useHistory();
  const [error, setError] = useState("");
  const { firestoreUser, currentUser, logout } = useAuth();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }
  if (!firestoreUser && currentUser) {
    return <div>Loading...</div>;
  }
  return (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters className={classes.toolbar}>
          <Grid item container alignItems="center">
            <Button
              component={Link}
              to={currentUser ? "/userhome" : "/guesthome"}
            >
              <img src={logo} alt="2+" style={{ width: "3em" }} />
            </Button>
            <Typography className={classes.navName}>Two Plus</Typography>
          </Grid>
          <Grid
            item
            container
            justify="flex-end"
            style={{ marginRight: "4em" }}
          >
            {currentUser ? (
              <Tabs>
                <Button
                  onClick={handleLogout}
                  classes={{ root: classes.button2 }}
                >
                  Log Out
                </Button>
                {firestoreUser.isAdmin && (
                  <Tab
                    component={Link}
                    to="/users"
                    label="Users"
                    className={classes.tab}
                  />
                )}
                {firestoreUser.isAdmin && (
                  <Tab
                    component={Link}
                    to="/signup"
                    label="Sign Up"
                    className={classes.tab}
                  />
                )}
                <Tab
                  component={Link}
                  to="/profile"
                  label="Account"
                  className={classes.tab}
                />
              </Tabs>
            ) : (
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
              </Tabs>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </React.Fragment>
  );
}
