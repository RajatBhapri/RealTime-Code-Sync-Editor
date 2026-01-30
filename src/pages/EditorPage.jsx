import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
// import ACTIONS from "../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import { ACTIONS } from "../Actions";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavgator = useNavigate();
  const { roomId } = useParams();
  const [clients, setclients] = useState([]);

  // console.log("useParams():", useParams());
  console.log(roomId); // "abc123"
  console.log("ROOM ID:", roomId, typeof roomId);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      function handleError(e) {
        console.log("socket error", e);
        toast.error("socket connection failed");
        reactNavgator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          setclients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        },
      );
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setclients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      const socket = socketRef.current;
      if (!socket) return;

      if (typeof socket.off === "function") {
        socket.off(ACTIONS.JOINED);
        socket.off(ACTIONS.DISCONNECTED);
      }

      if (typeof socket.disconnect === "function") {
        socket.disconnect();
      }
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("room Id copied");
    } catch (err) {
      toast.error("could not copy room Id");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavgator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="../code-sync.png" alt="logo" className="logoImage" />
          </div>
          <h3>CONNECTED</h3>
          <div className="clientsList">
            {" "}
            {clients.map((client) => (
              <Client key={client.socketid} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copybtn" onClick={copyRoomId}>
          copy room id
        </button>
        <button className="btn leavebtn" onClick={leaveRoom}>
          leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
