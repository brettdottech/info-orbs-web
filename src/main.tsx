import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter as Router} from "react-router-dom";
import "./styles/global.css";
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import {AuthProvider} from "./context/AuthContext.tsx";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);


root.render(
    // <StrictMode>
    <KindeProvider clientId={"efa32183640148e780abdf87683c8ece"} domain={"https://cedata.kinde.com"}
                   redirectUri={"http://localhost:5173"}>
        <AuthProvider>
            <Router>
                <App/>
            </Router>
        </AuthProvider>
    </KindeProvider>
    // </StrictMode>
);
