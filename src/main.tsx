import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import AppRoutes from "./routes/AppRoutes";
import "./styles/index.css";
import ToastContainer from "./components/UI/ToastContainer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
