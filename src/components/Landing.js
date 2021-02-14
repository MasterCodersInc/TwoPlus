import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Landing() {
  const { currentUser } = useAuth();
  const history = useHistory();
  if (currentUser) {
    history.push("/userhome");
  } else {
    history.push("/guesthome");
  }
  return <div></div>;
}
