import { PlayerDataType } from "./types/GroupPlayerTypes";

export default function calculatePlayerStats(players: PlayerDataType[]) {
  const countryCounts: { [country: string]: number } = {};
  let activeCount = 0;
  let inactiveCount = 0;

  players.forEach((player) => {
    // Count players by country
    if (countryCounts[player.country]) {
      countryCounts[player.country]++;
    } else {
      countryCounts[player.country] = 1;
    }

    // Count active and inactive players
    if (player.active) {
      activeCount++;
    } else {
      inactiveCount++;
    }
  });

  return {
    countryCounts,
    activeCount,
    inactiveCount,
  };
}
