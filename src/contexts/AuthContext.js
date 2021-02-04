import React, { useContext, useState, useEffect } from "react";
import firebase, { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [firestoreUser, setFirestoreUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    console.log("authc", email, password);
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      async function userFireStoreInfo() {
        const userObjLoc = await firebase
          .firestore()
          .collection("users")
          .where("email", "==", `${currentUser.email}`);
        const userData = await userObjLoc.get();
        userData.forEach((user) => setFirestoreUser(user.data()));
      }
      userFireStoreInfo();
    }
  }, [currentUser]);

  const value = {
    currentUser,
    firestoreUser,
    signup,
    logout,
    login,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
