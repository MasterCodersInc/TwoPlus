// eslint-disable-no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import firebase from "../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const firestore = firebase.firestore();
const collabData = firestore.collection("posts");

const useStyles = makeStyles((theme) => ({
  buttonEval: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
  },
}));

//function to run on editor load to grab correct docID
async function getDocRef(documentID) {
  const document = await collabData.doc(documentID);
  return document;
}

const EditorUID = ({ disabled, enableCollab }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [collab, setCollab] = useState(enableCollab);
  const uid = currentUser.email;
  const { postId } = useParams();
  const docID = postId;
  const reactAceRef = useRef();
  const editorOutput = useRef();
  let editor = useRef();
  let documentInfo = useRef();
  let documentReference = useRef();
  let applyingDeltas = false;
  let ownerId = useRef();

  //grab data on component did mount
  useEffect(() => {
    async function fetchData() {
      editor.current = reactAceRef.current.editor;
      documentReference.current = await getDocRef(docID);
      documentInfo.current = await documentReference.current.get();
      let documentData = documentInfo.current.data();
      ownerId.current = documentData.userRef;
      editor.current.setValue(documentData.editorData);

      //set up editor event listener. This is mostly for newUsers entering.
      editor.current.on("change", (e) => {
        if (collab || currentUser.uid === ownerId.current) {
          if (applyingDeltas) {
            return;
          }
          console.log("Inside cDidMount\ncollab:", collab);
          documentReference.current.update({
            editorData: editor.current.getValue(),
            docChanges: [{ changeID: uid, timeStamp: Date.now() }],
            deltas: e,
          });
        }
      });

      documentReference.current.onSnapshot(async () => {
        console.log("Inside Snapshot");
        let updatedInfoRef = await documentReference.current.get();
        let updatedInfo = updatedInfoRef.data();
        console.log(
          "EnableCollab from DB",
          updatedInfo.enableCollab,
          "state collab",
          collab,
          "prop collab",
          enableCollab
        );
        if (updatedInfo.enableCollab !== collab) {
          console.log(
            "inside if statement bcuz enableCollab",
            updatedInfo.enableCollab,
            "!== collab",
            collab
          );
          setCollab(updatedInfo.enableCollab);
          console.log("change collab to from snapshot", collab);
        } else {
          let userWhoMadeChanges = updatedInfo.docChanges[0].changeID;

          if (userWhoMadeChanges === uid) {
            return;
          }

          applyingDeltas = true;

          editor.current.setValue(updatedInfo.editorData);

          applyingDeltas = false;
        }
      });
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log('Collab has changed to', collab)
  //   reactAceRef.current.editor.on("change", (e) => {
  //     if (applyingDeltas) {
  //       return;
  //     }
  //     console.log('COLLAB', collab)
  //       console.log(collab, currentUser.uid === ownerId.current)
  //       documentReference.current.update({
  //         editorData: reactAceRef.current.editor.getValue(),
  //         docChanges: [{ changeID: uid, timeStamp: Date.now() }],
  //         deltas: e,
  //       });
  //   });
  // }, [collab])

  //componentDidUpdate disabled
  useEffect(() => {
    if (disabled) {
      reactAceRef.current.editor?.setReadOnly(true);
    } else {
      reactAceRef.current.editor?.setReadOnly(false);
    }
  }, [disabled]);

  // //componentDidUpdate collab
  // useEffect(() => {
  //   console.log('ENABLE COLLAB is', enableCollab)
  //   if(enableCollab){
  //     setCollab(true);
  //   } else{
  //     setCollab(false);
  //   }
  //   console.log('Collab changed to', collab)
  // })

  return (
    <>
      <Grid container>
        {/* <Grid item container> */}
        {/* <h4 style={{ marginLeft: 50 }}>{uid}</h4> */}
        <div style={{ display: "flex", flexDirection: "row", marginLeft: 50 }}>
          <AceEditor ref={reactAceRef} mode="javascript" theme="chaos" />
          <AceEditor ref={editorOutput} mode="javascript" />
        </div>
        {/* evaluate code in editor */}
        <button
          classes={{ root: classes.buttonEval }}
          onClick={() => {
            try {
              let ans = eval(editor.getValue());
              editorOutput.current.editor.setValue(String(ans), 1);
            } catch (e) {
              editorOutput.current.editor.setValue(e.message, 1);
            }
            return;
          }}
        >
          Eval Code
        </button>
      </Grid>
    </>
  );
};

export default EditorUID;
