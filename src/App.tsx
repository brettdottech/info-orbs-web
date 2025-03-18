import {Link, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/HomePage.tsx";
import ClockDetailPage from "./pages/ClockDetail/ClockDetailPage.tsx";
import UserAccountPage from "./pages/UserAccount/UserAccountPage.tsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useToken} from "./context/AuthContext.tsx";
import AddClockPage from "./pages/AddClock/AddClockPage.tsx";

function App() {
    const {register, login, logout, isAuthenticated, isLoading, user, getToken,} = useKindeAuth();
    const {setToken, hasRole} = useToken();
    const [tokenLoaded, setTokenLoaded] = useState<boolean>(false);

    useEffect(() => {
        const fetchToken = async () => {
            if (isLoading) {
                console.log("isLoading");
                return;
            }
            console.log("fetchToken", isAuthenticated)
            if (isAuthenticated) {
                const t = await getToken();
                if (t) {
                    setToken(t);
                    const dec = jwtDecode(t);
                    console.log("dec", dec);
                } else {
                    setToken(null);
                }
            } else {
                setToken(null);
            }
            setTokenLoaded(true);
        };
        fetchToken();
    }, [isAuthenticated, isLoading]);

    if (!tokenLoaded) {
        return <div>Loading...</div>;
    }
    return (
        <div className="app-container">
            {/* ToastContainer is placed globally, so it can show toasts from anywhere */}
            <ToastContainer
                position="top-center" // Position of the Toast notifications
                autoClose={3000} // Auto close after 3 seconds
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                draggable
            />
            <h1>Welcome to InfoOrbs</h1>
            <nav className="app-nav">
                <Link to="/">Home</Link>
                <div className="nav-links">
                    {user && (
                        <>
                            <Link to="/add-clock">Add Clock</Link>
                        </>
                    )}
                </div>
                {!user && (
                    <div className="nav-user">
                        <>
                            <button onClick={() => login()} type="button">Log In</button>
                            <button onClick={() => register()} type="button">Register</button>
                        </>
                    </div>
                )}
                {user && (
                    <div className="nav-user">
                        <span>Logged in as <span
                            style={{color: hasRole("admin") ? "red" : "white"}}>{user.givenName}</span></span>
                        <button onClick={() => logout("http://localhost:5173")}>Logout</button>
                    </div>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/clock/:id" element={<ClockDetailPage/>}/>
                {user && <Route path="/add-clock" element={<AddClockPage/>}/>}
                <Route path="/user" element={<UserAccountPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
