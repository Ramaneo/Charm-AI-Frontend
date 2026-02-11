import "vite/modulepreload-polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/components/App";
import "./theme.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   // <React.StrictMode>
//   <App home={home} />
//   // </React.StrictMode>
// );

// ReactDOM.createRoot(
//   document.getElementById("threejs-container-desktop")
// ).render(<App home={home} />);

function isMobile() {
  return window.matchMedia("(max-width: 775px)").matches;
}

let container = document.getElementById("aigen-container");

if (container) {
  ReactDOM.createRoot(container).render(<App home={home} />);
}
