import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";

const savedLang = localStorage.getItem("lang") || "en";
document.documentElement.setAttribute(
  "dir",
  savedLang === "ar" ? "rtl" : "ltr",
);
document.documentElement.setAttribute("lang", savedLang);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
