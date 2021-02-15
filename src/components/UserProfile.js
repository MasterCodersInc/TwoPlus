import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import "firebase/storage";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Loading from './Loading'

import rect from "../assets/userACCrec.svg";

const useStyles = makeStyles((theme) => ({
  shadowRectangle: {
    position: "absolute",
    zIndex: -1,
  },
  tabs: {
    marginLeft: "2.5em",
    marginTop: "3em",
  },
  tab: {
    textTransform: "none",
    fontFamily: "Montserrat",
    fontWeight: "500",
    color: theme.palette.common.colorTwo,
    "&:hover": {
      backgroundColor: theme.palette.common.colorFive,
    },
  },
  infoCont: {
    marginTop: "6em",
    marginLeft: "2.3em",
  },
  infoText: {
    //     marginTop: "2em",
    marginLeft: "5em",
  },
  editButton: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    fontFamily: "Montserrat",
    width: "5em",
    marginLeft: "10em",
  },
  uploadPhoto: {
    backgroundColor: "grey",
  },
}));

export default function UserProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const [newProfilePhoto, setNewProfilePhoto] = useState();
  const { firestoreUser } = useAuth();
  const storageRef = firebase.storage().ref();
  const fileRef = React.useRef();
  const imgRef = React.useRef();


  const imageUpload = async (imageFile) => {
    let imageRefId = `profile_pic${String(
      Math.floor(Math.random() * 100000)
    )}_${imageFile.name}`;

    let photoRef = await storageRef.child(imageRefId);
    await photoRef.put(imageFile);
    let imageURL = await photoRef.getDownloadURL();

    const userRef = firebase
      .firestore()
      .collection("users")
      .doc(firestoreUser.userDocRef);

    await userRef.update({ profilePhotoURL: imageURL });

    setNewProfilePhoto(imageURL);
  };

  if (!firestoreUser) {
    return <Loading />
  }
  return (
    <Grid container style={{maxWidth: '90vw', minHeight: '53.5vh'}}>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h1" style={{ marginLeft: "2.3em" }}>
            Welcome {firestoreUser && firestoreUser.firstName}
          </Typography>
        </Grid>
        <Grid item container className={classes.tabs}>
          <Tabs>
            <Tab label="Your Info" value={false} className={classes.tab} />
            <Tab
              value={false}
              component={Link}
              to="/myposts"
              label="My Posts"
              className={classes.tab}
            />
            <Tab
              value={false}
              component={Link}
              to="/savedcontent"
              label="++Content"
              className={classes.tab}
            />
            <Tab
              value={false}
              component={Link}
              to="/userFollowers"
              label="Followers"
              className={classes.tab}
            />
            <Tab
              value={false}
              component={Link}
              to="/userFollowings"
              label="Following"
              className={classes.tab}
            />
          </Tabs>
        </Grid>
        {firestoreUser && (
          <Grid item container alignItems="center" className={classes.infoCont}>
            <Grid item className={classes.infoText}>
              <img
                ref={imgRef}
                src={newProfilePhoto || firestoreUser.profilePhotoURL}
                onMouseEnter={(e) => {
                  e.currentTarget.style.cursor = "pointer";
                  e.currentTarget.src =
                    "https://firebasestorage.googleapis.com/v0/b/plus-2-9ae1d.appspot.com/o/profile-hover.png?alt=media&token=2b2c7847-4e87-4b56-904a-073613c13310";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.src = newProfilePhoto;
                }}
                onClick={() => {
                  fileRef.current.click();
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 10,
                  objectFit: "cover",
                }}
              />
              <input
                ref={fileRef}
                type="file"
                hidden={true}
                onChange={(e) => {
                  imageUpload(e.target.files[0]);
                }}
              />
            </Grid>
            <Grid item className={classes.infoText}>
              <Typography variant="body1">First Name</Typography>
              <Typography variant="body2">{firestoreUser.firstName}</Typography>
            </Grid>
            <Grid item className={classes.infoText}>
              <Typography variant="body1">Last Name</Typography>
              <Typography variant="body2">{firestoreUser.lastName}</Typography>
            </Grid>
            <Grid item className={classes.infoText}>
              <Typography variant="body1">Email</Typography>
              <Typography variant="body2">{firestoreUser.email}</Typography>
            </Grid>
            <Grid item className={classes.infoText}>
              <Typography variant="body1">Username</Typography>
              <Typography variant="body2">{firestoreUser.userName}</Typography>
            </Grid>
            <Button
              variant="contained"
              component={Link}
              to="updateprof"
              classes={{ root: classes.editButton }}
            >
              Edit
            </Button>
            <img
              src={rect}
              alt="rectangle with shadows"
              className={classes.shadowRectangle}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
