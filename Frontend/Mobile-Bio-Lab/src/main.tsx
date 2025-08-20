import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Import Materialize CSS and JS
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css"; 

// Initialize Materialize JS components
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
