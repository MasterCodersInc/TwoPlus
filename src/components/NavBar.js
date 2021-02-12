import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import logo from "../assets/logo.png";
import Lottie from "react-lottie";
import animationData from "../lotties/animation_kkyxn6gq.json";

// import logoAni from "../assets/logoAni.json";

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
  loading: {
    height: "100%",
  },
  button2: {
    backgroundColor: theme.palette.common.colorOne,
    color: "white",
    height: "2em",
    alignSelf: "center",
    fontFamily: "Montserrat",
    "&:hover": {
      color: "black",
    },
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <Box style={{ height: "100vh", width: "100vw" }}>
        <Grid
          item
          justify="center"
          alignItems="center"
          style={{ marginTop: "20%" }}
        >
          <Lottie options={defaultOptions} height={400} width={400} />
        </Grid>
      </Box>
    );
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
                {firestoreUser?.isAdmin && (
                  <Tab
                    component={Link}
                    to="/users"
                    label="Users"
                    className={classes.tab}
                  />
                )}
                {firestoreUser?.isAdmin && (
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
