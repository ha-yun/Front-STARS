import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { PlaceProvider } from "./context/PlaceContext";
import { Provider } from "react-redux";
import store from "./store";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <PlaceProvider>
                <App />
            </PlaceProvider>
        </Provider>
    </React.StrictMode>
);
