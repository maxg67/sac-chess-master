
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlayerCard from '@/components/PlayerCard';
import { useParams, useNavigate } from 'react-router-dom';

// Sample players data
const allPlayers = [
  { 
    id: 'p1', 
    name: 'Magnus Johnson', 
    score: 2, 
    wins: 2, 
    losses: 0, 
    draws: 0, 
    rank: 1,
    upcomingMatch: {
      opponent: 'John Player',
      round: 3,
      board: 2,
      time: '10:00 AM, June 12, 2025',
      location: 'Main Hall, Table 2'
    }
  },
  { 
    id: 'p2', 
    name: 'Anna Karlson', 
    score: 1.5, 
    wins: 1, 
    losses: 0, 
    draws: 1, 
    rank: 2 
  },
  { 
    id: 'p3', 
    name: 'Robert Fischer Jr.', 
    score: 1.5, 
    wins: 1, 
    losses: 0, 
    draws: 1, 
    rank: 3 
  },
  { 
    id: 'p4', 
    name: 'John Player', 
    score: 1.5, 
    wins: 1, 
    losses: 0, 
    draws: 1, 
    rank: 4,
    upcomingMatch: {
      opponent: 'Magnus Johnson',
      round: 3,
      board: 2,
      time: '10:00 AM, June 12, 2025',
      location: 'Main Hall, Table 2'
    }
  },
  // Add more players as needed
];

const PlayerLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allPlayers>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { playerId } = useParams();
  const navigate = useNavigate();

  // If player ID is provided in URL, find that player
  const playerFromUrl = playerId ? allPlayers.find(p => p.id === playerId) : undefined;
  
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

  return (
    <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
      <div className="bg-chess-dark text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl">Player Lookup</h1>
          <p className="text-gray-300">Find information about tournament participants</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {playerFromUrl ? (
          <div className="animate-fade-in">
            <Button 
              variant="outline" 
              onClick={() => navigate('/player-lookup')}
              className="mb-6"
            >
              ← Back to Search
            </Button>
            <div className="max-w-md mx-auto">
              <PlayerCard {...playerFromUrl} />
            </div>
          </div>
        ) : (
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
                          onClick={() => navigate(`/player-lookup/${player.id}`)}
                        >
                          <Card className="hover:border-chess-accent transition-colors">
                            <CardContent className="p-4">
                              <h3 className="font-serif font-bold text-xl mb-1">{player.name}</h3>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">ID: {player.id}</span>
                                <span className="text-sm">Rank: #{player.rank}</span>
                              </div>
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
        )}
      </div>
    </div>
  );
};

export default PlayerLookup;
