import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function FrontPageFollowButton({
  followingUIDs,
  post,
  firestoreUser,
  followUser,
}) {
  const theme = useTheme();

  if (
    followingUIDs.includes(post.userRef) ||
    post.userRef === firestoreUser.uid
  ) {
    return null;
  } else {
    return (
      <Button
        style={{
          backgroundColor: theme.palette.common.colorThree,
          fontFamily: "Montserrat",
          color: "#fff",
          height: "1.5em",
          fontSize: ".7em",
          marginLeft: "1em",
          "&:hover": {
            backgroundColor: theme.palette.common.colorFour,
          },
        }}
        onClick={(e) => {
          e.currentTarget.style.visibility = "hidden";
          followUser(post.userRef);
        }}
      >
        follow
      </Button>
    );
  }
}
