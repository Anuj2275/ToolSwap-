// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import {BrowserRouter} from 'react-router-dom'


createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
                  <App />
                </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
);
