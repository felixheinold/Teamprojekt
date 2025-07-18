// Leaderboard.tsx
import { useBackendUserContext } from "../../../context/BackendUserContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Leaderboard.css";
import { GeneralAPICallsService } from "../../../firebaseData/generalAPICallsService";

export type PlayerInLeaderboard = {
  user_rank: number
  user_name: string;
  user_highscore: number;
  user_profile_picture: string;
};

type UserStats = {
  [key: string]: {
    totalPoints: number;
  };
};

/*const dummyPlayers: Player[] = [
  { username: "Tom", score: 82, avatar: "avatar3.png" },
  { username: "Maya", score: 74, avatar: "avatar2.png" },
  { username: "Max", score: 65, avatar: "avatar4.png" },
  { username: "Sarah", score: 58, avatar: "avatar21.png" },
  { username: "Jonas", score: 47, avatar: "avatar19.png" },
  { username: "Eva", score: 39, avatar: "avatar13.png" },
  { username: "Leo", score: 33, avatar: "avatar9.png" },
  { username: "Anna", score: 29, avatar: "avatar20.png" },
  { username: "Ben", score: 24, avatar: "avatar8.png" },
];*/

export default function Leaderboard() {
  const { user } = useBackendUserContext();
  const { t } = useTranslation();
  //const [players, setPlayers] = useState<Player[]>([]);
  //const [rank, setRank] = useState<number | null>(null);
  const generalAPICallsService = new GeneralAPICallsService();
  const [top3, setTop3] = useState<PlayerInLeaderboard[]>([]);
  const [others, setOthers] = useState<PlayerInLeaderboard[]>([]);
 

  useEffect(() => {
      const fetchLeaderboard = async () => {
        try {
            const leaderboard: PlayerInLeaderboard [] = await generalAPICallsService.fetchCurrentLeaderboard();
            console.log("in Leaderboard.tsx: ", leaderboard);
            const top3Const: PlayerInLeaderboard[] = []; 
            const othersConst: PlayerInLeaderboard[] = [];
            leaderboard.forEach((player) =>{
              
              if(player.user_rank<4){
                  top3Const.push(player);
                }else{
                  othersConst.push(player);
                }
            });
            setTop3(top3Const);
            setOthers(othersConst);
            console.log("TOP3", top3Const);
            console.log("OTHERS",othersConst);
          }catch(error){
            console.log("Fehler bei Abruf des Leaderboards, Fehler in Leaderboard.tsx");
            console.log(error);
          }
      };
      fetchLeaderboard();
  }, []);
  
  

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
            <div className="player-name">{player.user_name}</div>
            <div className="player-score">
              {player.user_highscore} {t("leaderboard.points")}
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-list">
        {others.map((p, i) => (
          <div
            key={i}
            className={`leaderboard-entry ${
              user?.user_name === p.user_name ? "highlight" : ""
            }`}
          >
            <span className="entry-rank fw-bold">{i + 4}.</span>
            <div className="entry-user">
              <AvatarCircle player={p} size={40} />
              <span>{p.user_name}</span>
            </div>
            <span className="entry-score fw-semibold">
              {p.user_highscore} {t("leaderboard.points")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvatarCircle({ player, size }: { player: PlayerInLeaderboard; size: number }) {
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
      {player.user_profile_picture ? (
        <img
          src={`/avatars/${player.user_profile_picture}`}
          alt={player.user_name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span className="fw-bold text-dark" style={{ fontSize: size / 2.5 }}>
          {player.user_name[0]}
        </span>
      )}
    </div>
  );
}
