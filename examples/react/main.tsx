import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ai-design-system/react/style.css";
import "../shared/style.css";
import App from "./App";
createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
