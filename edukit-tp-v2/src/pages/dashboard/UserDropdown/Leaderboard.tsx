import { useUser } from "../../../context/UserContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  { username: "Maya", score: 74, avatar: "avatar4.png" },
  { username: "Max", score: 65, avatar: "avatar2.png" },
  { username: "Sarah", score: 58 },
  { username: "Jonas", score: 47 },
  { username: "Eva", score: 39 },
  { username: "Leo", score: 33 },
  { username: "Anna", score: 29 },
  { username: "Ben", score: 24 },
];

export default function Leaderboard() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("userStats") || "{}") as UserStats;
    const score = Object.values(stats).reduce(
      (sum, val) => sum + (typeof val.totalPoints === "number" ? val.totalPoints : 0),
      0
    );

    const currentPlayer: Player | null = user
      ? {
          username: user.userName,
          avatar: user.userProfilePicture,
          score,
        }
      : null;

    const combined = currentPlayer ? [...dummyPlayers, currentPlayer] : [...dummyPlayers];
    const sorted = combined.sort((a, b) => b.score - a.score);

    setPlayers(sorted);

    if (currentPlayer) {
      const myIndex = sorted.findIndex((p) => p.username === currentPlayer.username);
      setRank(myIndex + 1);
    }
  }, [user]);

  const top3 = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <div className="container py-4">
      <h1 className="fw-bold text-center display-5 mb-5">🏆 {t("leaderboard.title")}</h1>

      <div className="d-flex justify-content-center align-items-end gap-4 mb-5" style={{ height: 260 }}>
        {top3.map((player, index) => (
          <div className="text-center" style={{ width: 100 }} key={index}>
            <div style={{ marginBottom: "14px" }}>
              <AvatarCircle player={player} size={index === 0 ? 100 : 80} />
            </div>
            <div
              style={{
                height: index === 0 ? 80 : index === 1 ? 60 : 40,
                backgroundColor:
                  index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            ></div>
            <strong>{index + 1}. {t("leaderboard.place")}</strong>
            <div className="text-muted small">{player.username}</div>
            <div>{player.score} {t("leaderboard.points")}</div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column align-items-center gap-3">
        {others.map((p, i) => (
          <div
            key={i}
            className="w-100 border rounded d-flex justify-content-between align-items-center px-4 py-2"
            style={{
              maxWidth: "500px",
              backgroundColor: user?.userName === p.username ? "#ffeeba" : "#f8f9fa",
            }}
          >
            <span className="fw-bold">{i + 4}.</span>
            <div className="d-flex align-items-center gap-2">
              <AvatarCircle player={p} size={40} />
              <span>{p.username}</span>
            </div>
            <span className="fw-semibold">{p.score} {t("leaderboard.points")}</span>
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
