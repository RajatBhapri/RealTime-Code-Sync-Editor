// import { io } from "socket.io-client";
// import.meta.env.VITE_BACKEND_URL;

// export const initSocket = async () => {
//   const options = {
//     "force new connection": true,
//     reconnectionAttempt: true,
//     timeout: 10000,
//     transports: ["websocket"],
//   };
//   return io(import.meta.env.VITE_BACKEND_URL, options);
// };

import { io } from "socket.io-client";

console.log("SOCKET ENV URL 👉", import.meta.env.VITE_BACKEND_URL);

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempt: true,
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(import.meta.env.VITE_BACKEND_URL, options);
};
