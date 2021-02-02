import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import firebase from "./firebase";

const firestore = firebase.firestore();
const docRef = firestore.collection('collabData').doc('user1');

const Editor = (props) => {
  const reactAceRef = useRef(null);
  const [code, setCode] = useState('I AM CODE');
  let editor = useRef(null);
  let i = 0;
  //change in the editor
  //ROUTE A
  //1. send editor changes to the database
  //2. when database data changes, listener triggers
  //3. useEffect() which would change state of code
  //

  //componentDidMount
  useEffect( async () => {
    editor.current = reactAceRef.current.editor;
    const snapshot = await docRef.get();
    console.log('get from table', snapshot)
    editor.current.setValue(snapshot.data().newData, 1)
  },[])

  //ROUTE B
  //1. send editor changes and update state
  //2. when state updates, send to database
  //3. when database data changes, listener triggers
  //4. CHECK if the editor's current value = state
    //4a. If YES, do NOTHING! 
    //4b. Else, editor.setValue(state, 1)  

async function onChangeHandler (newData, event){
  console.log('FROM ONCHANGEHANDLER', newData)
  const snapshot = await docRef.get();
  if(newData !== snapshot.data().newData){
    sendToFirebase(newData)
  }
}

// useEffect(() => {
  
// }, [code])

// timestamp 

function sendToFirebase(updatedData) {
  console.log('befor we set the data' ,updatedData)
  docRef.set({newData: updatedData})
 
}


  docRef.onSnapshot((doc) => {
    if(editor.current){
      console.log('CHECKING SNAPSHOT METHOD: editor', editor.current.getValue(), 'newData', doc.data().newData)
      if(editor.current.getValue() !== doc.data().newData){
        editor.current.setValue(doc.data().newData, 1)
      } else{
        return;
      }
    }
  })

  // docRef.onSnapshot((doc) => {
  //   console.log('editors current value', editor.current.getValue())
  //   if(editor.current.getValue() !== doc.newData){
  //     console.log('doc', doc, 'editor.current.getValue()', editor.current.getValue())
  //     editor.current.setValue(doc, 1);
  //   }
  //   if(i < 2){
      
  //     i++;
  //   }
    
  //   // if(editor.current.getValue() !== code){
  //   //   editor.current.setValue(code, 1)
  //   // }
  // })


  return (
    <div>
      <AceEditor ref={reactAceRef} mode="javascript" theme="chaos" 
        onChange={onChangeHandler}
        />
      <button
        onClick={() => {
          sendToFirebase(editor.current.getValue());
        }}
      >
        Get Code?
      </button>
      <div>GHIYA I AM NOT IN THE ACE EDITOR</div>
    </div>
  );
};

export default Editor;
