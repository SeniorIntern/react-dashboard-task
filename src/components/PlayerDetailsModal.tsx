// PlayerDetailsModal.tsx
import React from "react";
import PlayerDataType from "../helpers/types/PlayerDataType";

interface PlayerDetailsModalProps {
  player: PlayerDataType | null;
  onClose: () => void;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({
  player,
  onClose,
}) => {
  if (!player) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <p className="text-[1.5rem] font-bold text-center text-[var(--orange)]">
          Player Details
        </p>
        <div className="w-full flex">
          <div className="w-1/2">
            <p>Player Id: {player.id}</p>
            <p>Name: {player.name}</p>
            <p>Country Code: {player.country}</p>
            <p>Active: {player.active ? "Yes" : "No"}</p>
          </div>
          <div className="w-1/2">
            <p>Coins: {player.statistics.coins}</p>
            <p>Games Won: {player.statistics.games_won}</p>
            <p>Games Played: {player.statistics.games_played}</p>
            <p>Experience Point: {player.statistics.experience_point}</p>
          </div>
        </div>
        {/* Add more player details here */}
        <div className="w-full flex justify-center pt-4">
          <button onClick={onClose} className="btn btn-orange">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailsModal;
