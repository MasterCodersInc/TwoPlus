// eslint-disable-no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import firebase from "./firebase";
const docID = "TD7BhcsTcki87KrsPkKy";
const uid = Math.floor(Math.random().toString() * 1000);
const openPageTimestamp = Date.now();

const firestore = firebase.firestore();
const collabData = firestore.collection("collabData");

//function to run on editor load to grab correct docID
async function getDocRef(documentID) {
  const document = await collabData.doc(documentID);
  return document;
}

const EditorUID = (props) => {
  const reactAceRef = useRef();
  let editor;
  let documentInfo;
  let documentReference;
  let applyingDeltas = false;

  //grab data on component did mount
  useEffect(() => {
    async function fetchData() {
      editor = reactAceRef.current.editor;
      documentReference = await getDocRef(docID);
      documentInfo = await documentReference.get();
      editor.setValue(documentInfo.data().pageData);

      //set up editor event listener. This is mostly for newUsers entering.
      editor.on("change", (e) => {
        if (applyingDeltas) {
          return;
        }

        documentReference.update({
          pageData: editor.getValue(),
          docChanges: [{ changeID: uid, timeStamp: Date.now() }],
          deltas: e,
        });

        console.log("changed in FB");
      });

      documentReference.onSnapshot(async () => {
        let updatedInfo = await documentReference.get();
        let userWhoMadeChanges = updatedInfo.data().docChanges[0].changeID;

        console.log("WHO CHANGED: ", userWhoMadeChanges, "ME: ", uid);

        if (userWhoMadeChanges === uid) {
          return;
        }

        applyingDeltas = true;
        editor.setValue(updatedInfo.data().pageData);
        // editor
        //   .getSession()
        //   .getDocument()
        //   .applyDeltas(updatedInfo.data().deltas);
        applyingDeltas = false;
      });
    }
    fetchData();
  }, []);

  //editor onChangeListener

  return (
    <div>
      <h4>{uid}</h4>
      <div>EDITOR UID TEST PAGE</div>
      <AceEditor ref={reactAceRef} mode="javascript" theme="chaos" />
    </div>
  );
};

export default EditorUID;
