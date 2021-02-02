import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {postsRef} from './Post'
// import { formatRelative } from 'date-fns';
///this component is responsible for formatting and reRendering this message data

// const formatDate = (date) => {
//   let formattedDate = '';
//   if (date) {
//     // Convert the date in words relative to the current date
//     formattedDate = formatRelative(date, new Date());

//     // Uppercase the first letter
//     formattedDate =
//       formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
//   }
//   return formattedDate;
// };

const ChatMsg = ({ text = '', uid ,}) => {
    const {currentUser} = useAuth()

    // console.log('this is all message', )
    // console.log('this is current user', currentUser.uid,  uid)
    console.log('do they match', currentUser.uid === uid)
  return (
    <div className='d-flex justify-content-center align-items-center w-100 mt-5'
    style={{
      minHeight: '100%'
    }}>
    {currentUser.uid === uid ? <p>{text}</p> : (
        <p>you have 0 messages</p>
    )}
      
    </div>
  );
};

//   ChatMsg.propTypes = {
//     text: PropTypes.string,
//     createdAt: PropTypes.shape({
//       seconds: PropTypes.number,
//     }),
//     displayName: PropTypes.string,
//     photoURL: PropTypes.string,
//   };

export default ChatMsg;
