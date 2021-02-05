import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  Radio,
  Grid,
  FormControlLabel,
  Typography,
  List,
  ListItem,
  IconButton
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CloseIcon from '@material-ui/icons/Close';

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
  tagList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 0,
    padding: 0,
    border: 'none'
  },
  tagItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    align: 'center',
    textAlign: 'center',
    background: '#5B56E9',
    borderRadius: '2px',
    color: '#ffffff',
    margin: '5px',
    padding: '5px',
    width: 'fit-content'
  }, 
  tagInput: {
    background: 'none',
    flexGrow: '1',
  },
  removeTag: {
    alignItems: 'center',
    background: '#333333',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    height: '15px',
    width: '15px',
    fontSize: '12px',
    borderRadius: '50%',
    display: 'inline-flex',
    justifyContent: 'center',
    marginLeft: '200px',
    paddingLeft: '10%',
    transform: 'rotate(45deg)',
  },
  tags: {
    align: 'center',
    textAlign: 'center',
    outline: 'none',
    border: 'none',
    width: 'fit-content',
    background: '#ffffff',
    maxWidth: '32%',
    '& input': {
      border: 'none',
      width: '100%',
      minWidth: '50px',
      '&:hover': {
        outline: 'none',
      }
    }
  }
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
  const [tags, setTags] = useState([])

  //db access
  const postsRef = firebase.firestore().collection("posts");
  const storageRef = firebase.storage().ref();

  //refs
  const fileRef = React.useRef();
  const tagInput = React.useRef();

  //functions
  const removeTag = (idx) => {
    const currentTags = tags;
    currentTags.splice(idx, 1);
    setTags([...currentTags])
  } 

  const addTag = (e) => {
    const newTag = e.target.value;
    if(newTag && e.key === 'Enter'){
      const foundTag = tags.filter(tag => 
        tag.toLowerCase() === newTag.toLowerCase())
      if(foundTag.length){
        return alert(`Tag already exists as ${foundTag[0]}`)
      }
      const newTags = [...tags, newTag];
      tagInput.current.value = null
      setTags([...newTags])
    }
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if(e.currentTarget.name === 'createPost'){
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
          enableCollab: true,
          imageRef: imageRefId,
        })
        .then((docRef) => {
          history.push({ pathname: `/posts/${docRef.id}`, postType: postType });
        });
    }
  };
// classes={classes.removeTag}> X </button> onClick={() => removeTag(idx)}
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
          <Grid className={classes.tags}>
            <List className={classes.tagList}>
              {
                tags.map((tag,idx) => {
                  return (
                    <ListItem key={idx} className={classes.tagItem}>
                      {tag} 
                      <IconButton
                        type='button'
                        name='removeTag' 
                        onClick={() => removeTag(idx)}>
                          <CloseIcon color='secondary' style={{ fontSize: 15}}/>
                      </IconButton>    
                    </ListItem>
                  )
                })
              }
              <ListItem className={classes.tagInput}>
                <TextField onKeyDown={addTag} ref={tagInput} />
              </ListItem>
            </List>
          </Grid>
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
            name='createPost'
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
