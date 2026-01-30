import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setusername] = useState("");

  const navigate = useNavigate();
  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("roomid and username is required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("created a room");
  };

  const handleEnterKey = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWraper">
      <div className="formWraper">
        <img
          className="homePageLogo"
          src="../code-sync.png"
          alt="code-sync-logo"
        />
        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
        <div className="inputgroup">
          <input
            type="text"
            className="inputbox"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleEnterKey}
          />
          <input
            type="text"
            className="inputbox"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            onKeyUp={handleEnterKey}
          />
          <button className="btn joinbtn" onClick={joinRoom}>
            JOIN
          </button>
        </div>

        <span className="createInfo">
          If You Dont Have An Invite Then Create{" "}
          <a className="createNewBtn" onClick={createNewRoom} href="#">
            Create Room
          </a>
        </span>
      </div>
      <footer>
        <h4>
          built with love by Rajat <a href="#">GitHUb</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
