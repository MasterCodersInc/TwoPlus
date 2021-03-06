import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import firebase from "../firebase";
import "firebase/storage";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  form: {
    align: "center",
    textAlign: "center",
    width: "75%",
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
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { signup, currentUser, firestoreUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== passwordConf) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      const newUser = await signup(email, password);
      firebase
        .firestore()
        .collection("users")
        .add({
          firstName: firstName
            .slice(0, 1)
            .toUpperCase()
            .concat(firstName.slice(1).toLowerCase()),
          lastName: lastName
            .slice(0, 1)
            .toUpperCase()
            .concat(lastName.slice(1).toLowerCase()),
          email,
          following: [],
          followers: [],
          isAdmin,
          uid: newUser.user.uid,
          userName,
          profilePhotoURL:
            "https://firebasestorage.googleapis.com/v0/b/two-plus.appspot.com/o/defaultProfile.png?alt=media&token=873620a6-1544-4308-8b0f-0e0f1d19e225",
        });
      await firebase
        .firestore()
        .collection("following")
        .doc(newUser.user.uid)
        .collection("userFollowing")
        .doc(newUser.user.uid)
        .set({
          userFollowing: [],
        });
      await firebase
        .firestore()
        .collection("followers")
        .doc(newUser.user.uid)
        .collection("userFollowers")
        .doc(newUser.user.uid)
        .set({
          userFollowers: [],
        });
      history.push("/userhome");
    } catch (error) {
      setError("Failed to create an account");
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <Grid container direction="column" justify="center" alignItems="center" style={{
      minWidth: '100vw',
      minHeight: '53.5vh',
      margin: '0 auto'}}>
      <Grid item>
        <Typography
          variant="h1"
          style={{
            marginBottom: "1em",
            color: theme.palette.common.colorOne,
          }}
        >
          Sign Up
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
          style={{ minWidth: "50%" }}
        >
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              name="firstName"
              label="First Name"
              onChange={(e) => setFirstName(e.currentTarget.value)}
              fullWidth
              variant="filled"
            ></TextField>
            <TextField
              name="lastName"
              label="Last Name"
              onChange={(e) => setLastName(e.currentTarget.value)}
              fullWidth
              variant="filled"
            ></TextField>
            <TextField
              name="email"
              placeholder="enter your email here"
              label="E-mail"
              onChange={(e) => setEmail(e.currentTarget.value)}
              fullWidth
              variant="filled"
            ></TextField>
            <TextField
              name="userName"
              placeholder="enter your userName here"
              label="User Name"
              onChange={(e) => setUserName(e.currentTarget.value)}
              fullWidth
              variant="filled"
            ></TextField>
            <Grid direction="row">
              <TextField
                name="password"
                type="password"
                placeholder="enter your password here"
                label="Password"
                onChange={(e) => setPassword(e.currentTarget.value)}
                variant="filled"
                style={{ width: "50%" }}
              ></TextField>
              <TextField
                style={{ width: "50%" }}
                name="passwordConf"
                type="password"
                placeholder="confirm your password here"
                label="Password Confirmation"
                onChange={(e) => setPasswordConf(e.currentTarget.value)}
                variant="filled"
              ></TextField>
            </Grid>
            {firestoreUser && firestoreUser.isAdmin && (
              <Grid>
                <FormControlLabel
                  value="isAdmin"
                  control={
                    <Checkbox
                      onChange={(e) => setIsAdmin(e.currentTarget.checked)}
                    />
                  }
                  label="Assign as Admin"
                  labelPlacement="end"
                  fullWidth
                  variant="filled"
                />
              </Grid>
            )}
            <Button
              disabled={loading}
              type="submit"
              classes={{ root: classes.button2 }}
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
