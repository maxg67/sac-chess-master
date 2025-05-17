
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlayerCard from '@/components/PlayerCard';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Define TypeScript interfaces for data structures
interface Profile {
  name: string;
}

interface PlayerData {
  id: string;
  name: string;
  board_number: number | null;
  score: number;
  wins: number;
  losses: number;
  draws: number;
  rank?: number;
  upcomingMatch?: {
    opponent: string;
    round: number;
    board: number;
    time: string;
    location: string;
  };
}

const fetchPlayer = async (id: string): Promise<PlayerData | null> => {
  try {
    // First get player information
    const { data: playerData, error: playerError } = await supabase
      .from('players')
      .select(`
        *,
        profiles:user_id(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (playerError) {
      console.error('Player fetch error:', playerError);
      throw playerError;
    }

    if (!playerData) {
      return null;
    }

    // Then get score information
    const { data: scoreData, error: scoreError } = await supabase
      .from('scores')
      .select('*')
      .eq('player_id', id)
      .maybeSingle();

    if (scoreError) {
      console.error('Score fetch error:', scoreError);
      throw scoreError;
    }

    // Then get upcoming match information if available
    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select(`
        *,
        opponent:players!player2_id(
          id, 
          profiles:user_id(*)
        ),
        round:round_id(
          round_number
        )
      `)
      .eq('player1_id', id)
      .eq('result', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (matchError) {
      console.error('Match fetch error:', matchError);
    }

    // Assemble the data
    const scoreInfo = scoreData || { wins: 0, losses: 0, draws: 0, total_score: 0 };
    
    // Extract profile name with proper null safety
    let profileName = 'Unknown Player';
    if (playerData.profiles) {
      // Cast profilesData as any to work with it safely
      const profilesData = playerData.profiles as any;
      if (profilesData && typeof profilesData === 'object' && profilesData !== null) {
        // Check if the object has a name property that's a string
        if ('name' in profilesData && typeof profilesData.name === 'string') {
          profileName = profilesData.name;
        }
      }
    }
    
    let upcomingMatch;
    if (matchData && matchData.opponent) {
      // Extract opponent name with proper null safety
      let opponentName = 'Unknown Opponent';
      if (matchData.opponent.profiles) {
        // Cast opponentProfilesData as any to work with it safely
        const opponentProfilesData = matchData.opponent.profiles as any;
        if (opponentProfilesData && typeof opponentProfilesData === 'object' && opponentProfilesData !== null) {
          // Check if the object has a name property that's a string
          if ('name' in opponentProfilesData && typeof opponentProfilesData.name === 'string') {
            opponentName = opponentProfilesData.name;
          }
        }
      }
      
      upcomingMatch = {
        opponent: opponentName,
        round: matchData.round?.round_number || 0,
        board: matchData.board_number || 0,
        time: 'TBD', // This would come from the round schedule
        location: 'TBD' // This would come from tournament or round info
      };
    }

    return {
      id: playerData.id,
      name: profileName,
      board_number: playerData.board_number,
      score: scoreInfo.total_score || 0,
      wins: scoreInfo.wins || 0,
      losses: scoreInfo.losses || 0,
      draws: scoreInfo.draws || 0,
      rank: 0, // This would be calculated from scores table
      upcomingMatch
    };
  } catch (error) {
    console.error('Error fetching player details:', error);
    toast.error('Failed to load player details');
    return null;
  }
};

const fetchAllPlayers = async (): Promise<PlayerData[]> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select(`
        *, 
        profiles:user_id(*), 
        scores:scores(wins, losses, draws, total_score)
      `)
      .limit(20);

    if (error) {
      console.error('Error fetching players:', error);
      throw error;
    }

    return (data || []).map((player, index) => {
      const scoreInfo = player.scores?.[0] || { wins: 0, losses: 0, draws: 0, total_score: 0 };
      
      // Extract profile name with proper null safety
      let profileName = 'Unknown Player';
      if (player.profiles) {
        // Cast profilesData as any to work with it safely
        const profilesData = player.profiles as any;
        if (profilesData && typeof profilesData === 'object' && profilesData !== null) {
          // Check if the object has a name property that's a string
          if ('name' in profilesData && typeof profilesData.name === 'string') {
            profileName = profilesData.name;
          }
        }
      }
      
      return {
        id: player.id,
        name: profileName,
        board_number: player.board_number,
        score: scoreInfo.total_score || 0,
        wins: scoreInfo.wins || 0, 
        losses: scoreInfo.losses || 0,
        draws: scoreInfo.draws || 0,
        rank: index + 1 // Simple ranking by order in the list
      };
    });
  } catch (error) {
    console.error('Error fetching all players:', error);
    toast.error('Failed to load players');
    return [];
  }
};

const PlayerLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PlayerData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { playerId } = useParams();
  const navigate = useNavigate();

  // Fetch single player if ID provided
  const { 
    data: playerData,
    isLoading: playerLoading, 
    error: playerError 
  } = useQuery({
    queryKey: ['player', playerId],
    queryFn: () => playerId ? fetchPlayer(playerId) : null,
    enabled: !!playerId
  });

  // Fetch all players for search
  const { 
    data: allPlayers = [],
    isLoading: playersLoading
  } = useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
    enabled: !playerId // Only fetch all players when not looking at a specific player
  });

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

  if (playerLoading || playersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
        <div className="bg-chess-dark text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl">Player Lookup</h1>
            <p className="text-gray-300">Loading player data...</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-chess-accent"></div>
        </div>
      </div>
    );
  }

  if (playerError) {
    return (
      <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
        <div className="bg-chess-dark text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl">Player Lookup</h1>
            <p className="text-gray-300">Error loading player information</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <p>There was an error loading the player information. Please try again later.</p>
              <Button onClick={() => navigate('/player-lookup')} className="mt-4">
                Return to lookup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
      <div className="bg-chess-dark text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl">Player Lookup</h1>
          <p className="text-gray-300">Find information about tournament participants</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {playerId && playerData ? (
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
        )}
      </div>
    </div>
  );
};

export default PlayerLookup;
