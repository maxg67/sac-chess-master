
import React from 'react';
import { Button } from '@/components/ui/button';
import PlayerCard from '@/components/PlayerCard';
import { useNavigate } from 'react-router-dom';
import { PlayerData, usePlayerData } from '@/hooks/usePlayerData';

interface PlayerDetailsProps {
  playerId: string;
}

const PlayerDetails: React.FC<PlayerDetailsProps> = ({ playerId }) => {
  const navigate = useNavigate();
  
  const { 
    data: playerData,
    isLoading: playerLoading, 
    error: playerError 
  } = usePlayerData(playerId);

  if (playerLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-chess-accent"></div>
      </div>
    );
  }

  if (playerError || !playerData) {
    return (
      <div className="text-center">
        <p>There was an error loading the player information. Please try again later.</p>
        <Button onClick={() => navigate('/player-lookup')} className="mt-4">
          Return to lookup
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Button 
        variant="outline" 
        onClick={() => navigate('/player-lookup')}
        className="mb-6"
      >
        ← Back to Search
      </Button>
      <div className="max-w-md mx-auto">
        <PlayerCard 
          {...playerData} 
          boardNumber={playerData.board_number || undefined}
        />
      </div>
    </div>
  );
};

export default PlayerDetails;
