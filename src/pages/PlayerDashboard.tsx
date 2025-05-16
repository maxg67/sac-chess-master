
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import PlayerCard from '@/components/PlayerCard';
import LeaderboardTable from '@/components/LeaderboardTable';

// Sample player data for the demo
const playerData = {
  id: 'p1',
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
  },
  matchHistory: [
    { round: 1, opponent: 'Robert Fischer Jr.', result: 'win', opponentScore: 1.5 },
    { round: 2, opponent: 'Anna Karlson', result: 'draw', opponentScore: 1.5 }
  ]
};

// Sample leaderboard data
const leaderboardData = [
  { id: 'p5', name: 'Magnus Johnson', score: 2, wins: 2, draws: 0, losses: 0 },
  { id: 'p2', name: 'Anna Karlson', score: 1.5, wins: 1, draws: 1, losses: 0 },
  { id: 'p3', name: 'Robert Fischer Jr.', score: 1.5, wins: 1, draws: 1, losses: 0 },
  { id: 'p1', name: 'John Player', score: 1.5, wins: 1, draws: 1, losses: 0 },
  { id: 'p4', name: 'Maria Chen', score: 1, wins: 1, draws: 0, losses: 1 },
  { id: 'p6', name: 'Hikaru Smith', score: 1, wins: 1, draws: 0, losses: 1 },
  { id: 'p7', name: 'Alexandra Jones', score: 0.5, wins: 0, draws: 1, losses: 1 },
  { id: 'p8', name: 'Peter Williams', score: 0, wins: 0, draws: 0, losses: 2 }
];

const PlayerDashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-chess-accent mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
      <div className="bg-chess-dark text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl">Player Dashboard</h1>
          <p className="text-gray-300">Welcome back, {profile?.name || user.email}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="matches">Match History</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Player Card */}
              <div className="lg:col-span-1">
                <PlayerCard {...playerData} />
              </div>

              {/* Tournament Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament Progress</CardTitle>
                    <CardDescription>Chess At SAC Summer Championship</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Tournament Progress */}
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Current Progress</h4>
                        <div className="w-full bg-secondary rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-chess-accent h-2.5 rounded-full" 
                            style={{ width: '33%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Round 2 completed</span>
                          <span>6 total rounds</span>
                        </div>
                      </div>

                      {/* Match Schedule */}
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Upcoming Round</h4>
                        <div className="bg-chess-success/10 p-4 rounded-md border border-chess-success/20 text-sm">
                          <p className="font-semibold mb-1">Round 3 starts tomorrow at 10:00 AM</p>
                          <p>Your board assignment: <span className="font-semibold">Board 2</span></p>
                        </div>
                      </div>

                      {/* Tournament Rules */}
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Tournament Rules</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Swiss System, 6 rounds</li>
                          <li>Time control: 10 minutes + 0 second increment</li>
                          <li>Tiebreaks: Buchholz, then Sonneborn-Berger</li>
                          <li>Default time: 10 minutes</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Match History</CardTitle>
                <CardDescription>Your games in the current tournament</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playerData.matchHistory.map((match, index) => (
                    <Card key={index} className={`
                      ${match.result === 'win' ? 'bg-chess-success/10 border-chess-success/30' :
                        match.result === 'draw' ? 'bg-chess-accent/10 border-chess-accent/30' :
                        'bg-destructive/10 border-destructive/30'
                      }
                    `}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Round {match.round}</p>
                          <p>Opponent: {match.opponent}</p>
                        </div>
                        <div className="text-right">
                          <p className="capitalize font-bold">
                            {match.result}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Opponent Score: {match.opponentScore}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="bg-chess-info/10 p-4 rounded-md border border-chess-info/30">
                    <p className="text-sm">
                      <span className="font-semibold">Next match:</span> Round 3 vs. Magnus Johnson
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Leaderboard</CardTitle>
                <CardDescription>Current standings for all players</CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardTable players={leaderboardData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerDashboard;
