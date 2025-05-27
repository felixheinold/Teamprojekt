import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Register from "./pages/Register";
import Modules from "./pages/Modules";
import Chapters from "./pages/Chapters";
import Minigames from "./pages/Minigames";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Register />} />
        <Route path="modules" element={<Modules />} />
        <Route path="chapters/:id" element={<Chapters />} />
        <Route path="minigames/:id/:chapter" element={<Minigames />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
