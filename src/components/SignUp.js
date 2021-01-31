import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function SignUp() {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const { signup, currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/signup");
    } catch {
      setError("Failed to log out");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== passwordConf) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      console.log("!!!!!", email, password);
      await signup(email, password);
    } catch (error) {
      setError("Failed to create an account");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography style={{ marginBottom: "3em" }}>Sign Up</Typography>
        <Typography> {currentUser && currentUser.email}</Typography>
        {error && <Typography>{error}</Typography>}
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            placeholder="enter your email here"
            label="E-mail"
            onChange={(e) => setEmail(e.currentTarget.value)}
          ></TextField>
          <TextField
            name="password"
            type="password"
            placeholder="enter your password here"
            label="Password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          ></TextField>
          <TextField
            name="passwordConf"
            type="password"
            placeholder="confirm your password here"
            label="Password Confirmation"
            onChange={(e) => setPasswordConf(e.currentTarget.value)}
          ></TextField>
          <Button disabled={loading} type="submit">
            Submit
          </Button>
        </form>
        <Button onClick={handleLogout}>Log Out</Button>
      </Grid>
    </Grid>
  );
}
