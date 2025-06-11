import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import Start from "./pages/auth/Start";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/dashboard/Home";
import Modules from "./pages/dashboard/Modules";
import Chapters from "./pages/dashboard/Chapters";
import Minigames from "./pages/dashboard/Minigames";
import User from "./pages/dashboard/User";
import Settings from "./pages/dashboard/Settings";
import Stats from "./pages/dashboard/Stats";          
import Leaderboard from "./pages/dashboard/Leaderboard";

import QuizStart from "./pages/quiz/QuizStart";
import QuizGame from "./pages/quiz/QuizGame";
import QuizResult from "./pages/quiz/QuizResult";

import MemoryStart from "./pages/memory/MemoryStart";
import MemoryRound1 from "./pages/memory/MemoryRound1";
import MemoryRound2 from "./pages/memory/MemoryRound2";
import MemoryRound1Result from "./pages/memory/MemoryRound1Result";
import MemoryRound2Result from "./pages/memory/MemoryRound2Result";

import GapFillGame from "./pages/gapfill/GapFillGame";
import GapFillStart from "./pages/gapfill/GapFillStart";
import GapFillResult from "./pages/gapfill/GapFillResult";

import NotFound from "./pages/common/NotFound";

function App() {
  return (
    <Routes>
      {/* Öffentliche Seiten (ohne Layout) */}
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Geschützte Seiten mit Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/chapters/:moduleName" element={<Chapters />} />
        <Route path="/minigames/:moduleId/:chapterId" element={<Minigames />} />
        <Route path="/user" element={<User />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />               {/* ✅ NEU */}
        <Route path="/leaderboard" element={<Leaderboard />} />   {/* ✅ NEU */}
        
        <Route path="/quiz" element={<QuizStart />} />
        <Route path="/quizgame" element={<QuizGame />} />
        <Route path="/quizresult" element={<QuizResult />} />

        <Route path="/memory" element={<MemoryStart />} />
        <Route path="/memoryround1" element={<MemoryRound1 />} />
        <Route path="/memoryround2" element={<MemoryRound2 />} />
        <Route path="/memoryround1result" element={<MemoryRound1Result />} />
        <Route path="/memoryround2result" element={<MemoryRound2Result />} />

        <Route path="/gapfill" element={<GapFillStart />} />
        <Route path="/gapfillgame" element={<GapFillGame />} />
        <Route path="/gapfillresult" element={<GapFillResult />} />
      </Route>

      {/* 404 Seite */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
