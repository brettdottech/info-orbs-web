import React, {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import styles from "./LoginPage.module.css";
import Card from "../../components/Card.tsx";

const LoginPage = () => {
    const {login} = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(email, password);
        navigate("/");
    };

    return (
        <div className={styles['login-page']}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <Card>
                    <div className={styles['flex-container']}>
                        <div className={styles['input-group']}>
                            <label htmlFor="email">email</label>
                            <input type="email" placeholder="Email" value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   required/>
                        </div>
                        <div className={styles['input-group']}>
                            <label htmlFor="password">password</label>
                            <input type="password" placeholder="Password" value={password}
                                   onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        <button type="submit">Login</button>
                    </div>
                </Card>
            </form>
        </div>
    );
};

export default LoginPage;
