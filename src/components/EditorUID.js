// eslint-disable-no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import firebase from "../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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
  const uid = currentUser?.email;
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
        if (applyingDeltas) {
          return;
        }
        documentReference.current.update({
          editorData: editor.current.getValue(),
          docChanges: [{ changeID: uid, timeStamp: Date.now() }],
          deltas: e,
        });
      });

      documentReference.current.onSnapshot(async () => {
        let updatedInfoRef = await documentReference.current.get();
        let updatedInfo = updatedInfoRef.data();
        let userWhoMadeChanges = updatedInfo.docChanges[0].changeID;

        if (userWhoMadeChanges === uid) {
          return;
        }

        applyingDeltas = true;
        editor.current.setValue(updatedInfo.editorData);
        editor.current.clearSelection();
        applyingDeltas = false;
      });
    }
    fetchData();
  }, []);

  //componentDidUpdate disabled
  useEffect(() => {
    if (disabled) {
      reactAceRef.current.editor?.setReadOnly(true);
    } else {
      reactAceRef.current.editor?.setReadOnly(false);
    }
  }, [disabled]);

  return (
    <>
      <Grid container>
        <div style={{ display: "flex", flexDirection: "row", marginLeft: 50 }}>
          <AceEditor ref={reactAceRef} mode="javascript" theme="chaos" />
          <AceEditor ref={editorOutput} mode="javascript" />
        </div>
        {/* evaluate code in editor */}
        <Button
          classes={{ root: classes.buttonEval }}
          style={{ root: { fontFamily: "Montserrat" } }}
          onClick={() => {
            try {
              let ans = eval(reactAceRef.current.editor.getValue());
              editorOutput.current.editor.setValue(String(ans), 1);
            } catch (e) {
              editorOutput.current.editor.setValue(e.message, 1);
            }
            return;
          }}
        >
          EVAL CODE
        </Button>
      </Grid>
    </>
  );
};

export default EditorUID;
