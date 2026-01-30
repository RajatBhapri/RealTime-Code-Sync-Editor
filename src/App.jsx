import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/editor/:roomId", element: <EditorPage /> },
  ]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ success: { theme: { primary: "#4aed88" } } }}
      ></Toaster>

      <RouterProvider router={router} />
    </>
  );
}

export default App;
