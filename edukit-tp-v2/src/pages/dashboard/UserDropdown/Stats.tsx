import React, { useEffect, useMemo, useState } from "react";
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
import "./Stats.css";
import { useBackendUserContext } from "../../../context/BackendUserContext";
import { GeneralAPICallsService } from "../../../firebaseData/generalAPICallsService";

type GameKey = "quiz" | "gapfill" | "memory";


type GeneralType = {
  highscore: number;
  highscoreTableRanking: number;
  totalPoints: number;
  dailyPointsGoal: number;
  lastPlayedAllGameTypes: string[]; //first position type, second position timestamp
}

type GameStats = {
  
  totalGames: number;
  totalPoints: number;
  maxPoints: number;
  bestScore: number;
  accuracy: number;
  lastPlayed: string;
  repetitionContent: string[];
  answeredCorrectlyContent: string[];

}

type GameStatsBackend = Record <GameKey, GameStats>;


const Stats = () => {
  const { t } = useTranslation();
  const { user } = useBackendUserContext();
  const generalAPICallsService = new GeneralAPICallsService();



  if (!user) return <div>Loading...</div>;

   const statsBackend = useMemo(() => {
    const gi = user.user_game_information;

    const gameStats: GameStatsBackend = {
      quiz: {
        totalGames: gi.quiz.total_games,
        totalPoints: gi.quiz.total_points,
        maxPoints: gi.quiz.best_Score,
        bestScore: gi.quiz.best_Score,
        accuracy: gi.quiz.accuracy,
        lastPlayed: gi.quiz.last_played,
        repetitionContent: gi.quiz.repetition_content,
        answeredCorrectlyContent: gi.quiz.answered_correctly_content
      },
      memory: {
        totalGames: gi.memory.total_games,
        totalPoints: gi.memory.total_points,
        maxPoints: gi.memory.best_Score,
        bestScore: gi.memory.best_Score,
        accuracy: gi.memory.accuracy,
        lastPlayed: gi.memory.last_played,
        repetitionContent: gi.memory.repetition_content,
        answeredCorrectlyContent: gi.memory.answered_correctly_content

      },
      gapfill: {
        totalGames: gi.gapfill.total_games,
        totalPoints: gi.gapfill.total_points,
        maxPoints: gi.gapfill.best_Score,
        bestScore: gi.gapfill.best_Score,
        accuracy: gi.gapfill.accuracy,
        lastPlayed: gi.gapfill.last_played,
        repetitionContent: gi.gapfill.repetition_content,
        answeredCorrectlyContent: gi.gapfill.answered_correctly_content

      },
      
    };

    const generalStats: GeneralType = {
       
        highscore: gi.highscore,
        highscoreTableRanking: gi.highscore_table_ranking,
        totalPoints: gi.total_points,
        dailyPointsGoal: gi.daily_points_goal,
        lastPlayedAllGameTypes: gi.last_played_all_game_types,
      
    }

    return { gameStats, generalStats };
  }, [user]);

  
    // letzer Spielestart
  const lastPlayedGame = statsBackend.generalStats.lastPlayedAllGameTypes[0];
  const lastPlayedDate = statsBackend.generalStats.lastPlayedAllGameTypes[1];

  const totalUnits = async (type:string) => {
    let res: any[] = [];
    if (type === "quiz") { res = await generalAPICallsService.fetchQuestionsWithQueryParams("?type=quiz");};
    if (type === "memory") { res = await generalAPICallsService.fetchQuestionsWithQueryParams("?type=memory");};
    if (type === "gapfill") { res = await generalAPICallsService.fetchQuestionsWithQueryParams("?type=gapfill");};

    return res.length;
  }

  // Daten fürs Chart
  const chartData = (["quiz", "memory", "gapfill"] as GameKey[]).map(game => ({
    name: t(`stats.${game}`),
    Punkte: statsBackend.gameStats[game].totalPoints,
  }));



  const renderProgressBar = (percent: string) => (
    <div className="progress">
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
      data.answeredCorrectlyContent.length > 0
        ? ((data.totalGames / totalUnits[gameKey]) * 100).toFixed(1)
        : "0.0";

    return (
      <div key={gameKey} className="stats-card">
        <h4 className="stats-subtitle">{t(`stats.${gameKey}`)}</h4>

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

  return (
    <div className="stats-wrapper">
      <div className="stats-inner">
        <h1 className="stats-title">📊 {t("stats.title")}</h1>

        {lastPlayedDate && lastPlayedGame && (
          <div className="stats-card">
            <h5>🕹️ {t("stats.lastPlayed")}</h5>
            <p>
              {new Date(lastPlayedDate).toLocaleString()} –{" "}
              <strong>{t(`stats.${lastPlayedGame}`)}</strong>
            </p>
          </div>
        )}

        {["quiz", "memory", "gapfill"].map((game) =>
          renderGameStats(game as GameKey, statsBackend.gameStats[game as GameKey])
        )}

        <div className="stats-card">
          <h4 className="stats-subtitle">📈 {t("stats.compare")}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Punkte" fill="#228b57">
                <LabelList dataKey="Punkte" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
