// eslint-disable-no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import firebase from "../firebase";
import {useParams} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext' 

const firestore = firebase.firestore();
const collabData = firestore.collection("posts");

//function to run on editor load to grab correct docID
async function getDocRef(documentID) {
  const document = await collabData.doc(documentID);
  return document;
}

const EditorUID = ({disabled}) => {
  const {currentUser} = useAuth();
  const uid = currentUser.email;
  const {postId} = useParams();
  const docID = postId;
  console.log('DOC ID:', docID)
  const reactAceRef = useRef();
  const editorOutput = useRef();
  let editor;
  let documentInfo;
  let documentReference;
  let applyingDeltas = false;

  //grab data on component did mount
  useEffect(() => {
    async function fetchData() {
      editor = reactAceRef.current.editor;
      documentReference = await getDocRef(docID);
      // console.log('DOC REF:', documentReference)
      documentInfo = await documentReference.get();
      // console.log('DOC INFO:', documentInfo.data());
      editor.setValue(documentInfo.data().editorData);

      //set up editor event listener. This is mostly for newUsers entering.
      editor.on("change", (e) => {
        if (applyingDeltas) {
          return;
        }

        documentReference.update({
          editorData: editor.getValue(),
          docChanges: [{ changeID: uid, timeStamp: Date.now() }],
          deltas: e,
        });

        // console.log("changed in FB");
      });

      documentReference.onSnapshot(async () => {
        let updatedInfo = await documentReference.get();
        let userWhoMadeChanges = updatedInfo.data().docChanges[0].changeID;

        // console.log("WHO CHANGED: ", userWhoMadeChanges, "ME: ", uid);

        if (userWhoMadeChanges === uid) {
          return;
        }

        applyingDeltas = true;

        editor.setValue(updatedInfo.data().editorData);

        applyingDeltas = false;
      });
    }
    fetchData();
  }, []);

  //componentDidUpdate
  useEffect(() => {
    if(disabled){
      reactAceRef.current.editor?.setReadOnly(true);
    } else{
      reactAceRef.current.editor?.setReadOnly(false);
    }
  },[disabled])

  return (
    <div>
      <h4 style={{ marginLeft: 50 }}>{uid}</h4>
      <div style={{ display: "flex", flexDirection: "row", marginLeft: 50 }}>
        <AceEditor ref={reactAceRef} mode="javascript" theme="chaos" />
        <AceEditor ref={editorOutput} mode="javascript" />
      </div>
      {/* evaluate code in editor */}
      <button
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
    </div>
  );
};

export default EditorUID;
