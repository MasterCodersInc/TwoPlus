import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';
import theme from './components/theme';

import Editor from './Editor';
import firebase from './firebase';

import { AuthProvider } from './contexts/AuthContext';

import ChatRoom from './components/ChatRoom';
import SignUp from './components/SignUp';
import Landing from './components/Landing';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';

firebase.firestore().collection('times').add({
  title: 'rubiks cube',
  time_seconds: 45,
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/editor" component={Editor} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgotpassword" component={ForgotPassword} />
            <Route exact Path="/chat" component={ChatRoom} />
            <PrivateRoute exact path="/profile" component={UserProfile} />
          </Switch>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
