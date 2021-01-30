import React, { useEffect } from "react";
import AceEditor from "react-ace";
import firebase from "./firebase";

const firestore = firebase.firestore();

const Editor = (props) => {
  const reactAceRef = React.useRef(null);
  let editor = null;

  useEffect(() => {
    editor = reactAceRef.current.editor;
  }, []);

  firestore
    .collection("collabData")
    .doc("user1")
    .onSnapshot((doc) => {
      console.log("COMING BACK FROM SERVER", doc.data());

      if (editor) {
        editor.setValue(doc.data().data, 1);
      }
    });

  const sendToFirebase = (data) => {
    console.log(data);
    firestore.collection("collabData").doc("user1").set({ data: data });
  };

  return (
    <div>
      <AceEditor ref={reactAceRef} mode="javascript" theme="chaos" />
      <button
        onClick={() => {
          sendToFirebase(editor.getValue());
        }}
      >
        Get Code?
      </button>
      <div>GHIYA I AM NOT IN THE ACE EDITOR</div>
    </div>
  );
};

export default Editor;
