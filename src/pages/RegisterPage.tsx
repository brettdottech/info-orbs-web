import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import config from "../config";
import {toast} from "react-toastify";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${config.backendURL}/auth/register`, {username, email, password});
            navigate("/login");
            toast.success("Registration successful");
        } catch (error) {
            console.error("Registration failed:", error);
            toast.error("Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                       required/>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                       required/>
                <input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)} required/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
