import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import { ThemeContextProvider } from "./contexts/themeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
);
