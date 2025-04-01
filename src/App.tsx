import {Link, Route, Routes} from "react-router-dom";
import BrowseClocksPage from "./pages/BrowseClocks/BrowseClocksPage.tsx";
import ClockDetailPage from "./pages/ClockDetail/ClockDetailPage.tsx";
import UserAccountPage from "./pages/UserAccount/UserAccountPage.tsx";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useToken} from "./context/AuthContext.tsx";
import AddClockPage from "./pages/AddClock/AddClockPage.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import WebFlashPage from "./pages/WebFlash/WebFlashPage.tsx";
import NavigationBar from "./components/NavigationBar.tsx";

function App() {
    const {isAuthenticated, isLoading, user, getToken} = useKindeAuth();
    const {setToken} = useToken();
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
    }, [getToken, isAuthenticated, isLoading, setToken]);

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
            <NavigationBar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/clocks" element={<BrowseClocksPage/>}/>
                <Route path="/clock/:id" element={<ClockDetailPage/>}/>
                {user && <Route path="/add-clock" element={<AddClockPage/>}/>}
                <Route path="/user" element={<UserAccountPage/>}/>
                <Route path="/flash" element={<WebFlashPage/>}/>
            </Routes>
            <div className="flex justify-end gap-1 mt-4 p-2 bg-gray-700 rounded-lg">
                Created by<Link className="link" target="_blank" to="https://brett.tech">brett.tech</Link>and friends
            </div>
        </div>
    );
}

export default App;
