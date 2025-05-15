
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlayerCardProps {
  name: string;
  id: string;
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

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  id,
  score,
  wins,
  losses,
  draws,
  rank,
  upcomingMatch
}) => {
  return (
    <Card className="border-chess-light/20 hover:border-chess-accent/50 transition-all">
      <CardHeader className="pb-2 bg-gradient-to-r from-chess-dark/5 to-chess-accent/5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif font-bold text-xl">{name}</h3>
            <span className="text-xs text-muted-foreground">ID: {id}</span>
          </div>
          {rank && (
            <Badge variant="outline" className="border-chess-accent text-chess-black">
              Rank #{rank}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid gap-4">
          {/* Score and Stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-chess-light/20 p-2 rounded-md">
              <h4 className="font-semibold text-xl">{score}</h4>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="bg-chess-success/10 p-2 rounded-md">
              <h4 className="font-semibold text-xl">{wins}</h4>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
            <div className="bg-chess-accent/10 p-2 rounded-md">
              <h4 className="font-semibold text-xl">{draws}</h4>
              <p className="text-xs text-muted-foreground">Draws</p>
            </div>
            <div className="bg-destructive/10 p-2 rounded-md">
              <h4 className="font-semibold text-xl">{losses}</h4>
              <p className="text-xs text-muted-foreground">Losses</p>
            </div>
          </div>
          
          {/* Upcoming Match Info */}
          {upcomingMatch && (
            <div className="border-t pt-4">
              <h4 className="font-serif font-semibold mb-2">Upcoming Match</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Opponent:</span>
                  <span className="font-medium">{upcomingMatch.opponent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Round:</span>
                  <span>{upcomingMatch.round}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Board:</span>
                  <span className="font-medium">{upcomingMatch.board}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{upcomingMatch.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{upcomingMatch.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
