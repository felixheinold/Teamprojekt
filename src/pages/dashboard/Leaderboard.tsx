import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";

// 🔠 Spielertyp
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

// 🔢 Dummy-Daten für andere Spieler
const dummyPlayers: Player[] = [
  { username: "Tom", score: 82, avatar: "avatar3.png" },
  { username: "Maya", score: 74, avatar: "avatar4.png" },
  { username: "Max", score: 65, avatar: "avatar2.png"},
  { username: "Sarah", score: 58 },
  { username: "Jonas", score: 47 },
  { username: "Eva", score: 39 },
  { username: "Leo", score: 33 },
  { username: "Anna", score: 29 },
  { username: "Ben", score: 24 },
];

export default function Leaderboard() {
  const { user } = useUser();
  const [players, setPlayers] = useState<Player[]>([]);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("userStats") || "{}") as UserStats;
    const score = Object.values(stats).reduce(
      (sum, val) => sum + (typeof val.totalPoints === "number" ? val.totalPoints : 0),
      0
    );

    const currentPlayer: Player | null = user
      ? { username: user.username, avatar: user.avatar, score }
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
      <h1 className="fw-bold text-center display-5 mb-5">🏆 Leaderboard</h1>

      {/* 🥇 Treppchen für Top 3 */}
      <div
        className="d-flex justify-content-center align-items-end gap-4 mb-5"
        style={{ height: 260 }}
      >
        {/* Platz 2 */}
        {top3[1] && (
          <div className="text-center" style={{ width: 100 }}>
            <div style={{ marginBottom: "14px" }}>
              <AvatarCircle player={top3[1]} size={80} />
            </div>
            <div
              style={{
                height: 60,
                backgroundColor: "#c0c0c0",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            ></div>
            <strong>2. Platz</strong>
            <div className="text-muted small">{top3[1].username}</div>
            <div>{top3[1].score} Punkte</div>
          </div>
        )}

        {/* Platz 1 */}
        {top3[0] && (
          <div className="text-center" style={{ width: 100 }}>
            <div style={{ marginBottom: "14px" }}>
              <AvatarCircle player={top3[0]} size={100} />
            </div>
            <div
              style={{
                height: 80,
                backgroundColor: "#ffd700",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            ></div>
            <strong>1. Platz</strong>
            <div className="text-muted small">{top3[0].username}</div>
            <div>{top3[0].score} Punkte</div>
          </div>
        )}

        {/* Platz 3 */}
        {top3[2] && (
          <div className="text-center" style={{ width: 100 }}>
            <div style={{ marginBottom: "14px" }}>
              <AvatarCircle player={top3[2]} size={80} />
            </div>
            <div
              style={{
                height: 40,
                backgroundColor: "#cd7f32",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            ></div>
            <strong>3. Platz</strong>
            <div className="text-muted small">{top3[2].username}</div>
            <div>{top3[2].score} Punkte</div>
          </div>
        )}
      </div>

      {/* 📋 Tabelle restlicher Spieler */}
      <div className="d-flex flex-column align-items-center gap-3">
        {others.map((p, i) => (
          <div
            key={i}
            className="w-100 border rounded d-flex justify-content-between align-items-center px-4 py-2"
            style={{
              maxWidth: "500px",
              backgroundColor: user?.username === p.username ? "#ffeeba" : "#f8f9fa",
            }}
          >
            <span className="fw-bold">{i + 4}.</span>
            <div className="d-flex align-items-center gap-2">
              <AvatarCircle player={p} size={40} />
              <span>{p.username}</span>
            </div>
            <span className="fw-semibold">{p.score} Punkte</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🟢 Avatar-Komponente mit optionalem Bild oder Initiale
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
