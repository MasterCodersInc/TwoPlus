import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";

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

export default function UpdateProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser, firestoreUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, password)
    const authenticatedUser = await currentUser.reauthenticateWithCredential(credential)
    if(authenticatedUser){
      const res = await firebase.firestore().collection('users').doc(`${firestoreUser.userDocRef}`).update({firstName:firstName, lastName: lastName, email:email})
      if (email !== currentUser.email) {
        await updateEmail(email);
      }
      if(res){
        setError('Successfully updated your account')
      } else{
        setError('Unable to update your account')
      }
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
          Update Profile
        </Typography>
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
              label="First Name"
              value={firstName}
              onChange={(e) =>setFirstName(e.currentTarget.value)}
              fullWidth
              variant="filled"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            ></TextField>
            <TextField
              label="Last Name"
              onChange={(e) => setLastName(e.currentTarget.value)}
              fullWidth
              variant="filled"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            ></TextField>
            <TextField
              name="email"
              label="E-mail"
              onChange={(e) => setEmail(e.currentTarget.value)}
              defaultValue={currentUser.email}
              fullWidth
              variant="filled"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            ></TextField>
            <TextField
              name="password"
              type="password"
              label="Confirm Password"
              onChange={(e) => setPassword(e.currentTarget.value)}
              fullWidth
              variant="filled"
              style={{ marginTop: "1em", marginBottom: "1em" }}
            ></TextField>

            <Button
              disabled={loading}
              type="submit"
              classes={{ root: classes.button1 }}
            >
              Update
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
