import React from 'react';

import { ThemeProvider, Message, MessageText } from '@livechat/ui-kit';
const theme = {
  vars: {
      'primary-color': '#427fe1',
      'secondary-color': '#fbfbfb',
      'tertiary-color': '#fff',
      'avatar-border-color': 'blue',
  },
  AgentBar: {
      Avatar: {
          size: '42px',
      },
      css: {
          backgroundColor: 'var(--secondary-color)',
          borderColor: 'var(--avatar-border-color)',
      }
  },
  Message: {
      css: {
          fontWeight: 'bold',
          backgroundColor: "purple",
      },
      MessageText: {
        backgroundColor: "purple",
      }
  },
}

const ChatMsg = ({ currentUserId, message }) => {
  console.log('this is message', message);
  console.log('this is message text ref', message.text.postRef);

  return (
    <ThemeProvider style={{ maxWidth: '10%', height: 400 }}>
    <Message date="21:38" isOwn={true} authorName="Visitor">
    <MessageText>
    {message.text}
    </MessageText>
  </Message>
    </ThemeProvider>
  );
};


export default ChatMsg;
