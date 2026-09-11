import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import AddAdventurer from "./pages/AddAdventurer";
import AddQuest from "./pages/AddQuest";
import AdventurerDetails from "./pages/AdventurerDetails";
import Adventurers from "./pages/Adventurers";
import Dashboard from "./pages/Dashboard";
import EditAdventurer from "./pages/EditAdventurer";
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
                <Route path={ROUTES.newAdventurer} element={<AddAdventurer />} />
                <Route path={ROUTES.adventurerDetails} element={<AdventurerDetails />} />
                <Route path={ROUTES.editAdventurer} element={<EditAdventurer />} />
                <Route path={ROUTES.newQuest} element={<AddQuest />} />
                <Route path={ROUTES.questDetails} element={<QuestDetails />} />
                <Route path={ROUTES.editQuest} element={<EditQuest />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
