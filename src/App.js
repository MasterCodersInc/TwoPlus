import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./components/theme";

import firebase from "./firebase";

import { AuthProvider } from "./contexts/AuthContext";

import SignUp from "./components/SignUp";
import Landing from "./components/Landing";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import NavBar from "./components/NavBar";
import EditorUID from "./components/EditorUID";
import Post from './components/Post'
import AddPost from './components/AddPost'

firebase.firestore()
//.collection("times").add({
//   title: "rubiks cube",
//   time_seconds: 45,
// });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/editor" component={EditorUID} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgotpassword" component={ForgotPassword} />
            <PrivateRoute exact path="/profile" component={UserProfile} />
            <PrivateRoute exact path="/updateprof" component={UpdateProfile} />
            <Route exact path='/posts/add'component={AddPost}/>
            <Route exact path='/posts/:postId'component={Post}/>
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
