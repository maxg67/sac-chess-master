
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define TypeScript interfaces for data structures
export interface Profile {
  name: string;
}

export interface PlayerData {
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

export const fetchPlayer = async (id: string): Promise<PlayerData | null> => {
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

export const fetchAllPlayers = async (): Promise<PlayerData[]> => {
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

export const usePlayerData = (playerId: string | undefined) => {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: () => playerId ? fetchPlayer(playerId) : null,
    enabled: !!playerId
  });
};

export const useAllPlayersData = (enabled: boolean) => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchAllPlayers,
    enabled
  });
};
