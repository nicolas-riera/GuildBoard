import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import QuestDetails from "./pages/QuestDetails";
import { ROUTES } from "./routes";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path={ROUTES.dashboard} element={<Dashboard />} />
                <Route path={ROUTES.questDetails} element={<QuestDetails />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
