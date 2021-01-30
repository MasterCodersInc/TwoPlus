import logo from "./logo.svg";
import "./App.css";
import Editor from "./Editor";
import firebase from "./firebase";

firebase.firestore().collection("times").add({
  title: "rubiks cube",
  time_seconds: 45,
});

function App() {
  return (
    <div>
      <h1>Just Clock It</h1>
      <Editor />
    </div>
  );
}

export default App;
