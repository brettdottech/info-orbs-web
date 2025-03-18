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
        return <div className="flex items-center justify-center h-screen text-white text-xl">Loading...</div>;
    }
    return (
        <div className="max-w-6xl mx-auto p-5 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
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
            <h1 className="text-3xl text-center font-bold mt-0 mb-3 text-white">Welcome to InfoOrbs</h1>
            <nav className="flex items-center gap-5 p-4 bg-gray-700 rounded-lg">
                <Link className="main link" to="/">Home</Link>
                <div className="flex gap-5">
                    {user && (
                        <Link className="main link" to="/add-clock">
                            Add Clock
                        </Link>
                    )}
                </div>
                {!user && (
                    <div className="ml-auto flex gap-5">
                        <button
                            onClick={() => login()}
                            type="button"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => register()}
                            type="button"
                            className="green"
                        >
                            Register
                        </button>
                    </div>
                )}
                {user && (
                    <div className="ml-auto flex items-center gap-3">
                        <span>
                            Logged in as{" "}
                            <span
                                className={`font-bold ${
                                    hasRole("admin") ? "text-red-500" : "text-white"
                                }`}
                            >
                                {user.givenName}
                            </span>
                        </span>
                        <button
                            onClick={() => logout("http://localhost:5173")}
                            className="red"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/clock/:id" element={<ClockDetailPage/>}/>
                {user && <Route path="/add-clock" element={<AddClockPage/>}/>}
                <Route path="/user" element={<UserAccountPage/>}/>
            </Routes>
            <div className="flex justify-end gap-1 mt-4 p-2 bg-gray-700 rounded-lg">
                Created by<Link className="link" target="_blank" to="https://brett.tech">brett.tech</Link>and friends
            </div>
        </div>
    );
}

export default App;
