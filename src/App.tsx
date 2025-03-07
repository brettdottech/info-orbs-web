import {Link, Route, Routes} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ClockDetailPage from "./pages/ClockDetailPage";
import AddClockPage from "./pages/AddClockPage";
import UserAccountPage from "./pages/UserAccountPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {ToastContainer} from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function App() {
    const {user, logout} = useContext(AuthContext)!;

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
            {/*<h1>InfoOrbs Clock Repo</h1>*/}
            <nav className="app-nav">
                {/*<div>InfoOrbs Clock Repo</div>*/}
                <Link to="/">Home</Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/add-clock">Add Clock</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            {/*<Link to="/register">Register</Link>*/}
                        </>
                    )}
                </div>
                {user && (
                    <div className="nav-user">
                        <span>Logged in as {user.username}</span>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/clock/:id" element={<ClockDetailPage/>}/>
                {user && <Route path="/add-clock" element={<AddClockPage/>}/>}
                <Route path="/user" element={<UserAccountPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
