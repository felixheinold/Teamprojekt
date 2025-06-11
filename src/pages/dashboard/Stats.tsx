import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

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

// Defaults
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
  const [stats, setStats] = useState(defaultStats);
  const [lastPlayed, setLastPlayed] = useState<LastPlayed | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userStats");
    if (stored) {
      setStats({ ...defaultStats, ...JSON.parse(stored) });
    }

    const last = localStorage.getItem("lastPlayed");
    if (last) {
      setLastPlayed(JSON.parse(last));
    }
  }, []);

  const renderProgressBar = (percent: string) => {
    return (
      <div className="progress" style={{ height: "10px" }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${percent}%` }}
          aria-valuenow={parseFloat(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    );
  };

  const renderGameStats = (title: string, gameKey: GameKey, data: GameStats) => {
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
      <div className="border p-3 rounded mb-4 bg-light shadow-sm">
        <h5>{title}</h5>
        <p>🧩 Spiele gespielt: <strong>{data.totalGames}</strong></p>
        <p>⭐ Gesamtpunkte: <strong>{data.totalPoints}</strong> / <strong>{data.maxPoints}</strong></p>
        <p>🏅 Beste Punktzahl: <strong>{data.bestScore}</strong></p>
        <p>📊 Durchschnitt: <strong>{avgScore}</strong> Punkte/Spiel</p>
        <p>📈 Fortschritt: <strong>{progress}%</strong></p>
        {renderProgressBar(progress)}
        <p className="mt-2">📚 Abgedeckte Inhalte: <strong>{questionCoverage}%</strong></p>
      </div>
    );
  };

  const chartData = [
    {
      name: "Quiz",
      Punkte: stats.quiz.totalPoints,
    },
    {
      name: "Memory",
      Punkte: stats.memory.totalPoints,
    },
    {
      name: "Lückentext",
      Punkte: stats.gapfill.totalPoints,
    },
  ];

  return (
    <div className="container py-5">
      <h1 className="mb-4">📊 Deine Statistik</h1>

      {lastPlayed && (
        <div className="mb-4">
          <h5>🕹️ Zuletzt gespielt</h5>
          <p>
            {new Date(lastPlayed.timestamp).toLocaleString()} – <strong>{lastPlayed.game.toUpperCase()}</strong>
          </p>
        </div>
      )}

      {renderGameStats("🧠 Quiz", "quiz", stats.quiz)}
      {renderGameStats("🃏 Memory", "memory", stats.memory)}
      {renderGameStats("✍️ Lückentext", "gapfill", stats.gapfill)}

      <div className="mt-5">
        <h4 className="mb-3">📈 Punktevergleich</h4>
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
