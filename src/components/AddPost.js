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
  const [userMedia, setUserMedia] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  //db access
  const postsRef = firebase.firestore().collection("posts");
  const storageRef = firebase.storage().ref();

  //refs
  const fileRef = React.useRef();
  const submitButton = React.useRef();

  const imageUpload = async (imageFile) => {
    submitButton.current.disabled = true;
    let imageRefId = `image_${String(Math.floor(Math.random() * 100000))}_${
      imageFile.name
    }`;
    let photoRef = await storageRef.child(imageRefId);
    await photoRef.put(imageFile);
    let imageURL = await photoRef.getDownloadURL();
    setImageURL(imageURL);
    submitButton.current.disabled = false;
    console.log("IMAGE??", imageURL);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

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
        enableCollab: true,
        imageURL: imageURL,
      })
      .then((docRef) => {
        history.push({ pathname: `/posts/${docRef.id}`, postType: postType });
      });
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minWidth: "50%", width: "70%" }}
          >
            <Typography
              style={{
                marginBottom: "1em",

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
              fullWidth
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
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              style={{ marginTop: "1em", marginBottom: "1em" }}
              variant="filled"
              fullWidth
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

            {postType === "discuss" && (
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
                    imageUpload(e.target.files[0]);
                    setUserMedia(e.target.files[0]);
                  }}
                />
                {imageURL && (
                  <div>
                    <Typography variant="body1">File to Upload:</Typography>
                    <img style={{ width: 150, height: 150 }} src={imageURL} />
                  </div>
                )}
              </div>
            )}

            <Button
              ref={submitButton}
              disabled={postType === "" || title === ""}
              type="submit"
              classes={{ root: classes.button1 }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddPost;
