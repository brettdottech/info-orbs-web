import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import "./styles/global.css";
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import {AuthProvider} from "./context/AuthContext.tsx";
import config from "./config.ts";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);


root.render(
    // <StrictMode>
    <KindeProvider clientId={config.kindeClientId} domain={config.kindeDomain}
                   redirectUri={config.frontendURL}>
        <AuthProvider>
            <Router>
                <App/>
            </Router>
        </AuthProvider>
    </KindeProvider>
    // </StrictMode>
);
