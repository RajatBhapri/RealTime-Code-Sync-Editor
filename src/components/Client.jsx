import React from "react";
import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="client">
      {/* console.log({username}) */}
      <Avatar name={username} size="50" round={14} />
      <span className="userName">{username}</span>
    </div>
  );
};

export default Client;
