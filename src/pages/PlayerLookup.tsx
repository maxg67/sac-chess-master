
import React from 'react';
import { useParams } from 'react-router-dom';
import PlayerSearch from '@/components/PlayerSearch';
import PlayerDetails from '@/components/PlayerDetails';
import PageHeader from '@/components/PageHeader';

const PlayerLookup = () => {
  const { playerId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
      <PageHeader 
        title="Player Lookup" 
        subtitle="Find information about tournament participants"
      />

      <div className="container mx-auto px-4 mt-8">
        {playerId ? (
          <PlayerDetails playerId={playerId} />
        ) : (
          <PlayerSearch />
        )}
      </div>
    </div>
  );
};

export default PlayerLookup;
