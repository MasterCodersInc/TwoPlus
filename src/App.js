import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Editor from "./Editor";
import firebase from "./firebase";

import { AuthProvider } from "./contexts/AuthContext";

import SignUp from "./components/SignUp";

firebase.firestore().collection("times").add({
  title: "rubiks cube",
  time_seconds: 45,
});

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/editor" component={Editor} />
            <Route exact path="/signup" component={SignUp} />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
