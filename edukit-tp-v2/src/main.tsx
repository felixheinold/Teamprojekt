import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AppFlowProvider } from "./context/AppFlowContext";
import "./index.css";
import "./i18n";
import { BackendUserProvider } from "./context/BackendUserContext";

const dark = localStorage.getItem("darkMode") === "true";
if (dark) {
  document.body.classList.add("bg-dark", "text-white");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <BackendUserProvider>
        <BrowserRouter>
          <AppFlowProvider>
            <App />
          </AppFlowProvider>
        </BrowserRouter>
      </BackendUserProvider>
    </UserProvider>
  </React.StrictMode>
);
