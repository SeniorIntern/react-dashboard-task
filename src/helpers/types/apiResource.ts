const baseUrl = import.meta.env.VITE_BASE_URL;
const apiResources = {
  base: baseUrl,
  allUser: `${baseUrl}/user`,
  addUser: `${baseUrl}/user`,
  login: `${baseUrl}/user/login`,
  refreshToken: `${baseUrl}/common/generaterefresh`,
  players: `${baseUrl}/user/players/all`,
  playerLogin: `${baseUrl}/player`,
  playerUpdate: `${baseUrl}/user/player/update`,
  playerState: `${baseUrl}/user/player/setInactive`,
  leaderboard: `${baseUrl}/leaderboard`,
};

export const apiResource = apiResources;
