import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { ThemeProvider, Message, MessageText } from "@livechat/ui-kit";
// const theme = {
//   vars: {
//     "primary-color": "#427fe1",
//     "secondary-color": "#fbfbfb",
//     "tertiary-color": "#fff",
//     "avatar-border-color": "blue",
//   },
//   AgentBar: {
//     Avatar: {
//       size: "42px",
//     },
//     css: {
//       backgroundColor: "var(--secondary-color)",
//       borderColor: "var(--avatar-border-color)",
//     },
//   },
//   Message: {
//     css: {
//       fontWeight: "bold",
//       backgroundColor: "purple",
//     },
//     MessageText: {
//       backgroundColor: "purple",
//     },
//   },
// };

const useStyles = makeStyles((theme) => ({
  form: {
    align: "center",
    textAlign: "center",
  },
  button1: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorOne,
    marginTop: "2em",
    fontFamily: "Montserrat",
    width: "8em",
  },
  button2: {
    color: "#fff",
    backgroundColor: theme.palette.common.colorTwo,
    fontFamily: "Montserrat",
    marginTop: "2em",
    width: "8em",
  },
}));

const ChatMsg = ({ currentUserId, message }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { fireStoreUser } = useAuth();
  console.log("this is message", message);
  console.log("this is message text ref", message.text.postRef);

  return (
    <ThemeProvider style={{ maxWidth: "80%", height: 400 }}>
      <Message
        style={{
          color: theme.palette.common.colorOne,
          fontFamily: "Montserrat",
        }}
        date="21:38"
        isOwn={true}
        authorName="visitor"
      >
        <MessageText>{message.text}</MessageText>
      </Message>
    </ThemeProvider>
  );
};

export default ChatMsg;
