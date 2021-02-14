import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: '100vw',
    minHeight: '53vh'
  },
  form: {
    align: "center",
    textAlign: "center",
  },
  button1: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    marginTop: "2em",
    fontFamily: "Montserrat",
    width: "8em",
  },
  button2: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorTwo,
    fontFamily: "Montserrat",
    marginTop: "2em",
    width: "8em",
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);

      history.push("/userhome");
    } catch (error) {
      setError("Failed to log in");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center" className={classes.container}>
      <Grid
        item
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Typography
          variant="h1"
          style={{
            marginBottom: "1em",
            marginTop: "2em",
            color: theme.palette.common.colorOne,
          }}
        >
          Log In
        </Typography>
        <Typography> {currentUser && currentUser.email}</Typography>
        {error && <Typography>{error}</Typography>}
      </Grid>
      <Grid
        item
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minWidth: "40%" }}
      >
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minWidth: "70%" }}
        >
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              name="email"
              placeholder="enter your email here"
              label="E-mail"
              onChange={(e) => setEmail(e.currentTarget.value)}
              fullWidth
              variant="filled"
            ></TextField>
            <TextField
              name="password"
              type="password"
              placeholder="enter your password here"
              label="Password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              fullWidth
              variant="filled"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            ></TextField>
            <Grid item>
              <Link to="/forgotpassword">Forgot Password?</Link>
            </Grid>

            <Button
              disabled={loading}
              type="submit"
              classes={{ root: classes.button1 }}
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
