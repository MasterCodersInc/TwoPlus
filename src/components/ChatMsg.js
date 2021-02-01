import React from 'react';
import { formatRelative } from 'date-fns';
///this component is responsible for formatting and reRendering this message data

const formatDate = (date) => {
  let formattedDate = '';
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());

    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

const ChatMsg = ({
  createdAt = null,
  text = '',
  displayName = '',
  photoURL = '',
}) => {
  return (
    <div className="bg black">
      {photoURL ? (
        <img
          src={photoURL}
          alt="Avatar"
          className="rounded-full mr-4"
          width={45}
          height={45}
        />
      ) : null}
      <div>
        <div className="flex items-center mb-1">
          {displayName ? (
            <p className="mr-2 text-primary-500">{displayName}</p>
          ) : null}
          {createdAt?.seconds ? (
            <span className="text-gray-500 text-xs">
              {formatDate(new Date(createdAt.seconds * 1000))}
            </span>
          ) : null}
        </div>
        <p>{text}</p>
        <p>{text}</p>
        <p>{text}</p>
      </div>
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
