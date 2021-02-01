import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  form: {
    align: "center",
    textAlign: "center",
  },
  button1: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    marginTop: "2em",
    fontFamily: "Montserrat",
    width: "12em",
  },
  button2: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorTwo,
    fontFamily: "Montserrat",
    marginTop: "2em",
    width: "8em",
  },
}));

export default function ForgotPassword() {
  const classes = useStyles();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your inbox for further instructions");
    } catch (error) {
      setError("Failed to reset password");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Typography
          variant="h1"
          style={{
            marginBottom: "1em",
            marginTop: "2em",
            color: theme.palette.common.colorOne,
          }}
        >
          Reset Password
        </Typography>
        <Typography>{message}</Typography>
        {error && <Typography>{error}</Typography>}
      </Grid>
      <Grid
        item
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ width: "70%" }}
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

          <Grid item>
            <Link to="/login">Log In</Link>
          </Grid>

          <Button
            disabled={loading}
            type="submit"
            classes={{ root: classes.button1 }}
          >
            Reset Password
          </Button>
        </form>
      </Grid>
    </Grid>
  );
}
