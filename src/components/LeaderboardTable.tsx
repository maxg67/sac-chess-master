import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Player {
  id: string;
  name: string;
  score: number;
  wins: number;
  draws: number;
  losses: number;
  tiebreaker?: number;
}

interface LeaderboardTableProps {
  players: Player[];
  showTiebreaker?: boolean;
  isInteractive?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  players, 
  showTiebreaker = false,
  isInteractive = true 
}) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // If tiebreaker is available, use it
    if (showTiebreaker && a.tiebreaker !== undefined && b.tiebreaker !== undefined) {
      return b.tiebreaker - a.tiebreaker;
    }
    // Otherwise use wins as tiebreaker
    return b.wins - a.wins;
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-chess-dark text-white">
            <TableHead className="w-16 text-white">Rank</TableHead>
            <TableHead className="text-white">Player</TableHead>
            <TableHead className="text-white text-center w-20">Score</TableHead>
            <TableHead className="text-white text-center w-16">Wins</TableHead>
            <TableHead className="text-white text-center w-16">Draws</TableHead>
            <TableHead className="text-white text-center w-16">Losses</TableHead>
            {showTiebreaker && <TableHead className="text-white text-center w-20">Tiebreaker</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((player, index) => (
            <TableRow 
              key={player.id} 
              className={`${index % 2 === 0 ? 'bg-chess-light/10' : 'bg-white'} ${isInteractive ? 'hover:bg-chess-accent/10 cursor-pointer' : ''}`}
            >
              <TableCell className="font-medium">
                {index === 0 && (
                  <Badge className="bg-chess-accent hover:bg-chess-accent/90 mr-1">
                    {index + 1}
                  </Badge>
                )}
                {index !== 0 && index + 1}
              </TableCell>
              <TableCell className="font-medium">
                {isInteractive ? (
                  <Link to={`/player-lookup/${player.id}`} className="hover:underline hover:text-chess-accent">
                    {player.name}
                  </Link>
                ) : (
                  player.name
                )}
              </TableCell>
              <TableCell className="text-center font-bold">{player.score}</TableCell>
              <TableCell className="text-center text-chess-success">{player.wins}</TableCell>
              <TableCell className="text-center text-chess-accent">{player.draws}</TableCell>
              <TableCell className="text-center text-destructive">{player.losses}</TableCell>
              {showTiebreaker && <TableCell className="text-center">{player.tiebreaker}</TableCell>}
            </TableRow>
          ))}
          
          {sortedPlayers.length === 0 && (
            <TableRow>
              <TableCell colSpan={showTiebreaker ? 7 : 6} className="text-center py-8 text-muted-foreground">
                No players available in the leaderboard.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
