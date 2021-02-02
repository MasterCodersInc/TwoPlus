import React from 'react';

const ChatMsg = ({ currentUserId, message}) => {

  return (
    <div className='d-flex justify-content-center align-items-center w-100 mt-5'
    style={{
      minHeight: '100%'
    }}>
    <div>
    { currentUserId ? <li>{message.text}</li> : (
        <h2> you don't belong here</h2>
    )}
    </div>
    </div>
  );
};



export default ChatMsg;
