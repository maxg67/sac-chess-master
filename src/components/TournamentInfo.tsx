
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TournamentInfoProps {
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  currentRound: number;
  totalRounds: number;
  totalPlayers: number;
  contactEmail: string;
}

const TournamentInfo: React.FC<TournamentInfoProps> = ({
  name,
  description,
  venue,
  startDate,
  endDate,
  currentRound,
  totalRounds,
  totalPlayers,
  contactEmail
}) => {
  return (
    <Card className="border-2 border-chess-accent/20 overflow-hidden">
      <div className="h-3 bg-chess-accent w-full"></div>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between mb-1">
          <CardTitle className="text-2xl font-serif">{name}</CardTitle>
          <Badge className="bg-chess-success hover:bg-chess-success/90">
            Active Tournament
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Venue</h4>
              <p>{venue}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Dates</h4>
              <p>{startDate} - {endDate}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Contact</h4>
              <p>
                <a href={`mailto:${contactEmail}`} className="text-chess-info hover:underline">
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Current Status</h4>
              <div className="flex items-center mt-1">
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-chess-accent h-2.5 rounded-full" 
                    style={{ width: `${(currentRound / totalRounds) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">
                  Round {currentRound} of {totalRounds}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Players</h4>
              <p>{totalPlayers} registered players</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Format</h4>
              <p>Swiss System, {totalRounds} rounds</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentInfo;
