import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useTranslation } from "react-i18next";

// Typen
type GameKey = "quiz" | "gapfill" | "memory";
type GameStats = {
  totalGames: number;
  totalPoints: number;
  maxPoints: number;
  bestScore: number;
};
type LastPlayed = {
  game: GameKey;
  timestamp: string;
};
type ModuleChapterStats = {
  totalPoints: number;
  maxPoints: number;
};
type ExtendedStats = Record<GameKey, GameStats> & {
  byModuleAndChapter?: Record<string, ModuleChapterStats>;
};

const defaultStats: Record<GameKey, GameStats> = {
  quiz: { totalGames: 0, totalPoints: 0, maxPoints: 0, bestScore: 0 },
  memory: { totalGames: 0, totalPoints: 0, maxPoints: 0, bestScore: 0 },
  gapfill: { totalGames: 0, totalPoints: 0, maxPoints: 0, bestScore: 0 },
};

const totalQuestions: Record<GameKey, number> = {
  quiz: 50,
  memory: 30,
  gapfill: 40,
};

const Stats = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<ExtendedStats>(defaultStats);
  const [lastPlayed, setLastPlayed] = useState<LastPlayed | null>(null);
  const [moduleChapterStats, setModuleChapterStats] = useState<
    Record<string, ModuleChapterStats>
  >({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userStats");
      const parsed = stored ? JSON.parse(stored) : {};
      setStats({ ...defaultStats, ...parsed });
      if (parsed.byModuleAndChapter) {
        setModuleChapterStats(parsed.byModuleAndChapter);
      }
    } catch (error) {
      console.error("Fehler beim Parsen von userStats:", error);
      localStorage.removeItem("userStats");
    }

    try {
      const last = localStorage.getItem("lastPlayed");
      if (last) {
        setLastPlayed(JSON.parse(last));
      }
    } catch (error) {
      console.error("Fehler beim Parsen von lastPlayed:", error);
    }
  }, []);

  const renderProgressBar = (percent: string) => (
    <div className="progress" style={{ height: "10px" }}>
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: `${percent}%` }}
        aria-valuenow={parseFloat(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );

  const renderGameStats = (gameKey: GameKey, data: GameStats) => {
    const progress =
      data.maxPoints > 0
        ? ((data.totalPoints / data.maxPoints) * 100).toFixed(1)
        : "0.0";

    const avgScore =
      data.totalGames > 0 ? Math.round(data.totalPoints / data.totalGames) : 0;

    const questionCoverage =
      totalQuestions[gameKey] > 0
        ? ((data.totalGames / totalQuestions[gameKey]) * 100).toFixed(1)
        : "0.0";

    return (
      <div key={gameKey} className="border p-3 rounded mb-4 bg-light shadow-sm">
        <h5>{t(`stats.${gameKey}`)}</h5>
        <p>
          {t("stats.gamesPlayed")}: <strong>{data.totalGames}</strong>
        </p>
        <p>
          {t("stats.totalPoints")}: <strong>{data.totalPoints}</strong> /{" "}
          <strong>{data.maxPoints}</strong>
        </p>
        <p>
          {t("stats.bestScore")}: <strong>{data.bestScore}</strong>
        </p>
        <p>
          {t("stats.average")}: <strong>{avgScore}</strong>
        </p>
        <p>
          {t("stats.progress")}: <strong>{progress}%</strong>
        </p>
        {renderProgressBar(progress)}
        <p className="mt-2">
          {t("stats.coverage")}: <strong>{questionCoverage}%</strong>
        </p>
      </div>
    );
  };

  const chartData = (["quiz", "memory", "gapfill"] as GameKey[]).map(
    (game) => ({
      name: t(`stats.${game}`),
      Punkte: stats[game].totalPoints,
    })
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4">📊 {t("stats.title")}</h1>

      {lastPlayed && (
        <div className="mb-4">
          <h5>🕹️ {t("stats.lastPlayed")}</h5>
          <p>
            {new Date(lastPlayed.timestamp).toLocaleString()} –{" "}
            <strong>{t(`stats.${lastPlayed.game}`)}</strong>
          </p>
        </div>
      )}

      {["quiz", "memory", "gapfill"].map((game) =>
        renderGameStats(game as GameKey, stats[game as GameKey])
      )}

      <div className="mt-5">
        <h4 className="mb-3">📈 {t("stats.compare")}</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Punkte" fill="#5cb85c">
              <LabelList dataKey="Punkte" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
