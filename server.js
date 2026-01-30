
import express from "express"
const app = express();

import http from "http";
import { fileURLToPath } from 'url';
import {Server} from "socket.io"
import { ACTIONS } from "./src/Actions.js";
import path from "path";

app.use(express.static('dist'));
app.use((req,res,next) => {
   const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist', 'index.html');
  res.sendFile(path.join(filePath))
})


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}
function getAllConnectedClients(roomId) {
 return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
  return{
    socketId,
    username: userSocketMap[socketId]
  }
 })
}

io.on("connection", (socket) => {
  console.log("socket coonected", socket.id);

  socket.on(ACTIONS.JOIN, ({roomId, username}) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId)
    const clients = getAllConnectedClients(roomId)


    
    clients.forEach(({socketId})=>{
      io.to(socketId).emit(ACTIONS.JOINED,{
        clients,
        username,
        socketId: socket.id, 

    
    
      })
    })
  })

  socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
    // console.log('recieving',code)
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
  });

  socket.on(ACTIONS.SYNC_CODE, ({socketId, code}) => {
    // console.log('recieving',code)
    io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
  });

  socket.on("disconnecting",() => {
    const rooms = [...socket.rooms]
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
        socketId: socket.id,
        username : userSocketMap[socket.id],
      })
    })
    delete userSocketMap[socket.id];
    socket.leave()
  })
});

const PORT = process.env.port || 3000;
server.listen(PORT, () => console.log(`listen on port number ${PORT}`));
