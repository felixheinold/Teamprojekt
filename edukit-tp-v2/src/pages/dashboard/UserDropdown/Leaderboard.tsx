// Leaderboard.tsx
import { useUser } from "../../../context/UserContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Leaderboard.css";

type Player = {
  username: string;
  avatar?: string;
  score: number;
};

type UserStats = {
  [key: string]: {
    totalPoints: number;
  };
};

const dummyPlayers: Player[] = [
  { username: "Tom", score: 82, avatar: "avatar3.png" },
  { username: "Maya", score: 74, avatar: "avatar2.png" },
  { username: "Max", score: 65, avatar: "avatar4.png" },
  { username: "Sarah", score: 58, avatar: "avatar21.png" },
  { username: "Jonas", score: 47, avatar: "avatar19.png" },
  { username: "Eva", score: 39, avatar: "avatar13.png" },
  { username: "Leo", score: 33, avatar: "avatar9.png" },
  { username: "Anna", score: 29, avatar: "avatar20.png" },
  { username: "Ben", score: 24, avatar: "avatar8.png" },
];

export default function Leaderboard() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    const stats = JSON.parse(
      localStorage.getItem("userStats") || "{}"
    ) as UserStats;
    const score = Object.values(stats).reduce(
      (sum, val) =>
        sum + (typeof val.totalPoints === "number" ? val.totalPoints : 0),
      0
    );

    const currentPlayer: Player | null = user
      ? {
          username: user.userName,
          avatar: user.userProfilePicture,
          score,
        }
      : null;

    const combined = currentPlayer
      ? [...dummyPlayers, currentPlayer]
      : [...dummyPlayers];
    const sorted = combined.sort((a, b) => b.score - a.score);

    setPlayers(sorted);

    if (currentPlayer) {
      const myIndex = sorted.findIndex(
        (p) => p.username === currentPlayer.username
      );
      setRank(myIndex + 1);
    }
  }, [user]);

  const top3 = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <div className="leaderboard-wrapper">
      <h1 className="leaderboard-title">🏆 {t("leaderboard.title")}</h1>

      <div className="leaderboard-top3">
        {top3.map((player, index) => (
          <div className="leaderboard-top-player" key={index}>
            <div className="avatar-wrapper">
              <AvatarCircle player={player} size={index === 0 ? 100 : 80} />
            </div>
            <div className={`leaderboard-podium podium-${index + 1}`}></div>
            <strong>
              {index + 1}. {t("leaderboard.place")}
            </strong>
            <div className="player-name">{player.username}</div>
            <div className="player-score">
              {player.score} {t("leaderboard.points")}
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-list">
        {others.map((p, i) => (
          <div
            key={i}
            className={`leaderboard-entry ${
              user?.userName === p.username ? "highlight" : ""
            }`}
          >
            <span className="entry-rank fw-bold">{i + 4}.</span>
            <div className="entry-user">
              <AvatarCircle player={p} size={40} />
              <span>{p.username}</span>
            </div>
            <span className="entry-score fw-semibold">
              {p.score} {t("leaderboard.points")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvatarCircle({ player, size }: { player: Player; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#e2e6ea",
        overflow: "hidden",
      }}
      className="d-flex align-items-center justify-content-center"
    >
      {player.avatar ? (
        <img
          src={`/avatars/${player.avatar}`}
          alt={player.username}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span className="fw-bold text-dark" style={{ fontSize: size / 2.5 }}>
          {player.username[0]}
        </span>
      )}
    </div>
  );
}
