import "./axiosConfig"; // Ensure interceptors are set up early
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import "./styles/global.css";
import {StrictMode} from "react";
import {AuthProvider} from "./context/AuthProvider.tsx";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);


root.render(
    <StrictMode>
        <Router>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </Router>
    </StrictMode>
);
