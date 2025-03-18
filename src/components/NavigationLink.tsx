import {Link, useLocation} from "react-router-dom";

function NavigationLink({to, children}: { to: string; children: React.ReactNode }) {
    const location = useLocation();

    // Check if the current path matches the `to` prop
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`main link ${isActive ? "active-link" : ""}` /* Add class conditionally */}
        >
            {children}
        </Link>
    );
}

export default NavigationLink;