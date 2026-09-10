import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import AddQuest from "./pages/AddQuest";
import AdventurerDetails from "./pages/AdventurerDetails";
import Adventurers from "./pages/Adventurers";
import Dashboard from "./pages/Dashboard";
import EditQuest from "./pages/EditQuest";
import NotFound from "./pages/NotFound";
import QuestDetails from "./pages/QuestDetails";
import { ROUTES } from "./routes";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path={ROUTES.dashboard} element={<Dashboard />} />
                <Route path={ROUTES.adventurers} element={<Adventurers />} />
                <Route path={ROUTES.adventurerDetails} element={<AdventurerDetails />} />
                <Route path={ROUTES.newQuest} element={<AddQuest />} />
                <Route path={ROUTES.questDetails} element={<QuestDetails />} />
                <Route path={ROUTES.editQuest} element={<EditQuest />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
