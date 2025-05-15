
import React, { useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Sample player data
const allPlayers = [
  { id: 'p1', name: 'Magnus Johnson', score: 2, wins: 2, draws: 0, losses: 0, tiebreaker: 4 },
  { id: 'p2', name: 'Anna Karlson', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 3.5 },
  { id: 'p3', name: 'Robert Fischer Jr.', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 3 },
  { id: 'p4', name: 'John Player', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 2.75 },
  { id: 'p5', name: 'Maria Chen', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 2.5 },
  { id: 'p6', name: 'Hikaru Smith', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 2 },
  { id: 'p7', name: 'Alexandra Jones', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 1.5 },
  { id: 'p8', name: 'Peter Williams', score: 0.5, wins: 0, draws: 1, losses: 1, tiebreaker: 1 },
  { id: 'p9', name: 'David Lopez', score: 0.5, wins: 0, draws: 1, losses: 1, tiebreaker: 0.75 },
  { id: 'p10', name: 'Susan Kim', score: 0, wins: 0, draws: 0, losses: 2, tiebreaker: 0.5 },
  { id: 'p11', name: 'Michael Brown', score: 0, wins: 0, draws: 0, losses: 2, tiebreaker: 0.25 },
  { id: 'p12', name: 'Emma Wilson', score: 0, wins: 0, draws: 0, losses: 2, tiebreaker: 0 },
];

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTiebreaker, setShowTiebreaker] = useState(true);
  
  // Filter players based on search term
  const filteredPlayers = allPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
      <div className="bg-chess-dark text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl">Tournament Leaderboard</h1>
          <p className="text-gray-300">Chess At SAC Summer Championship</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Current Standings</CardTitle>
            <CardDescription>
              After Round 2 of 6 - Updated June 11, 2025, 6:30 PM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="w-48">
                <Select
                  value={showTiebreaker ? "true" : "false"}
                  onValueChange={(value) => setShowTiebreaker(value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Display Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Show Tiebreakers</SelectItem>
                    <SelectItem value="false">Hide Tiebreakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <LeaderboardTable 
              players={filteredPlayers} 
              showTiebreaker={showTiebreaker}
            />
            
            {filteredPlayers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No players found matching "{searchTerm}"
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md border border-chess-light/30 animate-fade-in">
          <h2 className="font-serif text-2xl mb-4 font-semibold">About the Tournament</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Format</h3>
              <p className="text-muted-foreground">
                This tournament follows the Swiss System with 6 rounds. Players with similar scores are paired together.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Scoring</h3>
              <p className="text-muted-foreground">
                Win: 1 point, Draw: 0.5 points, Loss: 0 points
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-1">Tiebreak System</h3>
              <p className="text-muted-foreground">
                1. Buchholz Score (sum of opponents' scores)<br />
                2. Sonneborn-Berger Score (sum of defeated opponents' scores + half of drawn opponents' scores)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
