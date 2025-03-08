import "./axiosConfig"; // Ensure interceptors are set up early
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import "./styles/index.css";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);


root.render(
    <Router>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </Router>
);
