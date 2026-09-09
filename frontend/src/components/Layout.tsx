import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "../routes";

export default function Layout() {
    return (
        <div className="page">
            <header className="topbar">
                <h1 className="topbar__title">
                    <Link to={ROUTES.dashboard}>GuildBoard</Link>
                </h1>
                <nav className="topbar__nav">
                    <button type="button" className="topbar__link">
                        Adventurers
                    </button>
                </nav>
            </header>

            <Outlet />
        </div>
    );
}
