import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import ChatMsg from './ChatMsg';
import { useAuth } from '../contexts/AuthContext';
// this display's  the chat message.. and input field to allow user to send message

const ChatRoom = () => {
  const { currentUser } = useAuth();
  const db = firebase.firestore();
  const {uid} = currentUser
  const {email} = currentUser
//   const userInfo = db.collection("users").doc(email)

  const [messages, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState('');

//   console.log('specific user info', userInfo)


// console.log('im the current user', currentUser.email)
  //we storing the chat msg's of our user inside our messages coll

  //Order and limit data
  //By default, a query retrieves all documents that satisfy the query in ascending order by document ID. You can specify the sort order for your data using orderBy(), and you can limit the number of documents retrieved using limit().

  useEffect(() => {
    if (db) {
        // console.log('this is db', db)
      const unsubscribe = db
        .collection('messages')
        .orderBy("uid")
        .limit(50)
        .onSnapshot((querySnapshot) => {
          // get all documents from collection - with ids
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          //then update the state
          setMessage(data);
      
        });

      //detach listener
      return unsubscribe;
    }
  }, [db]);
// console.log('this is user id', )
  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    //missing userID
    if (db) {
        
      // Add new message in Firestore
      db.collection('messages').add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
       uid, //generates a timestamp
      });
    }
  };
//   const currentUserMessages = currentUser.uid 
console.log('all message uid', messages );
// console.log('user uid', uid);
  const specificUser = messages.uid == currentUser.uid
  console.log('a specific user  message', specificUser );
  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <ChatMsg {...message} />
          </li>
         
        ))}
      </ul>
      <div className="mb-6 mx-4">
        <form onSubmit={handleOnSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Type your message here..."
          />
          <button type="submit" disabled={!newMessage}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
