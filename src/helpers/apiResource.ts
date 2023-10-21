const baseUrl = import.meta.env.VITE_BASE_URL;
/* /player resource is used for login, register by admin/staff. fetch details for players*/
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
  leaderboard: `${baseUrl}/player/leaderboard`,
  searchPlayer: `${baseUrl}/user/players/all?`,
  playGame: `${baseUrl}/player/play/game`,
  allRoom: `${baseUrl}/chats/allRoom`,
  roomChat: `${baseUrl}/chats/room?roomName=`,
  personalConversation: `${baseUrl}/chats/personal`,
};

export const apiResource = apiResources;
