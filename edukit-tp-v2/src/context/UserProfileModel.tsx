export type GameType = {
  total_games: number;
  total_points: number;
  max_points: number,
  best_Score: number;
  accuracy: number;
  last_played: string;
  repetition_content: string[];
  answered_correctly_content: string[];
};

export type UserGameInformation = {
  highscore: number;
  highscore_table_ranking: number;
  total_points: number;
  daily_points_goal: number;
  last_played_all_game_types: string[]; //first position type, second position timestamp
  quiz: GameType;
  memory: GameType;
  gapfill: GameType;
};

export type UserProfile = {
  user_id: string;
  user_mail: string;
  user_name: string;
  user_profile_picture: string;
  profile_creation_date: string;
  last_login_date: string;
  login_count: number;
  total_login_time: string;
  preferred_language: string;
  preferred_theme: string;
  user_game_information: UserGameInformation;
};
