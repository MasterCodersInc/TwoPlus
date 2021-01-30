import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyCSqQ39xBQ8VYgY3MlB0KtvolT-BlBkB1I",
  authDomain: "two-plus.firebaseapp.com",
  databaseURL: "https://two-plus-default-rtdb.firebaseio.com",
  projectId: "two-plus",
  storageBucket: "two-plus.appspot.com",
  messagingSenderId: "167071841158",
  appId: "1:167071841158:web:0591883805fc6e20d54a07",
  measurementId: "G-DVMMR0M5RP",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
