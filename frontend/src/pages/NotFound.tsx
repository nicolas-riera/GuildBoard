import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../routes";

import "../styles/pages/quest-details.css";

export default function NotFound() {
    const { pathname } = useLocation();

    return (
        <main className="quest-detail">
            <div className="quest-detail__header">
                <h2 className="quest-detail__title">Page not found</h2>
            </div>

            <p className="empty-row">No page matches "{pathname}".</p>

            <div className="quest-detail__footer">
                <Link to={ROUTES.dashboard} className="btn">
                    Back to the board
                </Link>
            </div>
        </main>
    );
}
