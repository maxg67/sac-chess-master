
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAllPlayersData, PlayerData } from '@/hooks/usePlayerData';

interface PlayerSearchProps {
  onSelectPlayer?: (playerId: string) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onSelectPlayer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PlayerData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Fetch all players for search
  const { 
    data: allPlayers = [],
    isLoading: playersLoading
  } = useAllPlayersData(!onSelectPlayer); // Only fetch when not looking at a specific player

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }
    
    const results = allPlayers.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      player.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    if (onSelectPlayer) {
      onSelectPlayer(playerId);
    } else {
      navigate(`/player-lookup/${playerId}`);
    }
  };

  if (playersLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-chess-accent"></div>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Search Players</CardTitle>
        <CardDescription>
          Find players by name or ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Enter player name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {hasSearched && (
          <div className="mt-6">
            {searchResults.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {searchResults.map(player => (
                  <div 
                    key={player.id} 
                    className="cursor-pointer" 
                    onClick={() => handlePlayerSelect(player.id)}
                  >
                    <Card className="hover:border-chess-accent transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-serif font-bold text-xl mb-1">{player.name}</h3>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">ID: {player.id}</span>
                          <span className="text-sm">Rank: #{player.rank}</span>
                        </div>
                        {player.board_number && (
                          <div className="mt-2">
                            <span className="text-sm font-medium">Board #{player.board_number}</span>
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t flex justify-between">
                          <span>Score: {player.score}</span>
                          <span className="text-sm">
                            {player.wins}W / {player.draws}D / {player.losses}L
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No players found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerSearch;
