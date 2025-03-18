import {useState} from "react";
import {Link} from "react-router-dom";
import NavigationLink from "./NavigationLink.tsx";
import {useToken} from "../context/AuthContext.tsx";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import config from "../config.ts";

const NavigationBar = () => {
    const {user, login, register, logout} = useKindeAuth();
    const {hasRole} = useToken();
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="p-4 bg-gray-700 rounded-lg flex items-center justify-between">
            {/* Hamburger Menu Button (visible on small screens) */}
            <button
                className="sm:hidden text-white focus:outline-none"
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                {/* Simple Hamburger Icon */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Standard Navigation Links (hidden on small screens) */}
            <div className="hidden sm:flex items-center gap-5">
                <NavigationLink to="/">Home</NavigationLink>
                <NavigationLink to="/flash">WebFlasher</NavigationLink>
                <NavigationLink to="/clocks">Browse Clocks</NavigationLink>
            </div>

            {/* Overlay Menu for Small Screens */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col items-center justify-center text-white">
                    <button
                        className="absolute top-5 right-5 focus:outline-none"
                        onClick={() => setMenuOpen(false)}
                    >
                        {/* Close Icon */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {/* Links in the Floating Menu */}
                    <Link
                        to="/"
                        className="text-2xl py-2 hover:text-gray-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/flash"
                        className="text-2xl py-2 hover:text-gray-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        WebFlasher
                    </Link>
                    <Link
                        to="/clocks"
                        className="text-2xl py-2 hover:text-gray-300"
                        onClick={() => setMenuOpen(false)}
                    >
                        Browse Clocks
                    </Link>
                </div>
            )}
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
                        onClick={() => logout(config.frontendURL)}
                        className="red"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default NavigationBar;