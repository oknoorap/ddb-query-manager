import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const init = (): Promise<string> =>
  new Promise((resolve) => {
    const appRoot = document.createElement("div");
    appRoot.id = "ddb-query-manager";
    document.body.appendChild(appRoot);
    resolve(appRoot.id);
  });

init().then((appId) => {
  ReactDOM.createRoot(document.getElementById(appId)!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
