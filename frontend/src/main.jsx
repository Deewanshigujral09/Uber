import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import UserDataContextProvider from "./context/UserContext";
import "./index.css";
import "./App.css";
import CaptainContext from "./context/CaptainContext.jsx";
import UserContext from "./context/UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CaptainContext>
      <UserContext>
        <BrowserRouter>
          <UserDataContextProvider>
            <App />
          </UserDataContextProvider>
        </BrowserRouter>
      </UserContext>
    </CaptainContext>
  </React.StrictMode>
);
