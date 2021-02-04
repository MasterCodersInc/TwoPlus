import React, { useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  Radio,
  Grid,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useAuth } from "../contexts/AuthContext";
import firebase from "../firebase";
import "firebase/storage";

const useStyles = makeStyles((theme) => ({
  form: {
    align: "center",
    textAlign: "center",
  },
  button1: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    marginTop: "1.5em",
    fontFamily: "Montserrat",
    width: "8em",
  },
  button2: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorTwo,
    fontFamily: "Montserrat",
    marginTop: "1.5em",
    width: "8em",
  },
}));

const AddPost = ({ history }) => {
  //hooks
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser } = useAuth();

  //state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("");
  const [userMedia, setUserMedia] = useState();

  //db access
  const postsRef = firebase.firestore().collection("posts");
  const storageRef = firebase.storage().ref();

  //refs
  const fileRef = React.useRef();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let photoRef;
    let imageRefId = null;
    if (userMedia) {
      imageRefId = `image_${String(Math.floor(Math.random() * 100000))}_${
        userMedia.name
      }`;
    }

    if (postType === "you") {
      photoRef = storageRef.child(imageRefId);
      photoRef.put(userMedia).then((snapshot) => {});
    }

    postsRef
      .add({
        userRef: currentUser.uid,
        title: title,
        description,
        postType: postType,
        editorData: "Start Coding Here!",
        docChanges: [{ changeID: "" }],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        isActive: true,
        imageRef: imageRefId,
      })
      .then((docRef) => {
        history.push({ pathname: `/posts/${docRef.id}`, postType: postType });
      });
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minWidth: "50%", marginTop: "2em" }}
        >
          <Typography
            style={{
              marginBottom: "1em",
              marginTop: "2em",
              color: theme.palette.common.colorOne,
            }}
          >
            Make a new post!
          </Typography>
          <TextField
            label="title"
            name="title"
            value={title}
            style={{ marginTop: "1em", marginBottom: "1em" }}
            onChange={(e) => setTitle(e.currentTarget.value)}
            variant="filled"
          />
          {title === "" && (
            <Typography
              style={{
                marginBottom: "1em",

                color: theme.palette.common.colorThree,
              }}
            >
              Your post must include a descriptive title.
            </Typography>
          )}
          <TextField
            label="description"
            name="description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            style={{ marginTop: "1em", marginBottom: "1em" }}
            variant="filled"
          />
          <RadioGroup
            row={true}
            onChange={(e) => setPostType(e.currentTarget.value)}
          >
            <FormControlLabel value="live" control={<Radio />} label="Live" />
            <FormControlLabel
              value="discuss"
              control={<Radio />}
              label="Discuss"
            />
            <FormControlLabel value="you" control={<Radio />} label="You" />
          </RadioGroup>
          {postType === "" && (
            <Typography
              style={{
                marginBottom: "1em",
                color: theme.palette.common.colorThree,
              }}
            >
              You must choose a post type.
            </Typography>
          )}
          {postType === "you" && (
            <div>
              <Button
                type="button"
                classes={{ root: classes.button2 }}
                style={{ width: "fit-content", marginBottom: ".5em" }}
                onClick={() => {
                  fileRef.current.click();
                }}
              >
                Upload a pic of your sick rig!
              </Button>

              <input
                ref={fileRef}
                type="file"
                hidden={true}
                onChange={(e) => {
                  setUserMedia(e.target.files[0]);
                }}
              />
            </div>
          )}
          {userMedia && (
            <Typography variant="body1">
              File to Upload: {userMedia.name}
            </Typography>
          )}
          <Button
            disabled={
              postType === "" ||
              title === "" ||
              (postType === "you" && !userMedia)
            }
            type="submit"
            classes={{ root: classes.button1 }}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default AddPost;
