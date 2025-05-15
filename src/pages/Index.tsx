
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TournamentInfo from '@/components/TournamentInfo';
import LeaderboardTable from '@/components/LeaderboardTable';

// Sample data for demonstration
const tournamentInfo = {
  name: 'Chess At SAC Summer Championship',
  description: 'The annual summer chess tournament at SAC featuring players from all skill levels.',
  venue: 'SAC Main Hall',
  startDate: 'June 10, 2025',
  endDate: 'June 16, 2025',
  currentRound: 2,
  totalRounds: 6,
  totalPlayers: 32,
  contactEmail: 'tournament@chessatsac.com'
};

const topPlayers = [
  { id: 'p1', name: 'Magnus Johnson', score: 2, wins: 2, draws: 0, losses: 0, tiebreaker: 4 },
  { id: 'p2', name: 'Anna Karlson', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 3.5 },
  { id: 'p3', name: 'Robert Fischer Jr.', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 3 },
  { id: 'p4', name: 'Maria Chen', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 2.5 },
  { id: 'p5', name: 'Hikaru Smith', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 2 }
];

const Index = () => {
  return (
    <div className="min-h-screen chess-pattern">
      {/* Hero Section */}
      <section className="bg-chess-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 animate-fade-in">
            Chess At <span className="text-chess-accent">SAC</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-300">
            The premier chess tournament management platform for organizers and players.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/leaderboard">
              <Button className="bg-chess-accent hover:bg-chess-accent/90 text-chess-black font-medium text-lg px-6 py-6">
                View Leaderboard
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-chess-accent text-white hover:bg-chess-accent/20 text-lg px-6 py-6">
                Player Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tournament Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-serif text-3xl mb-10 font-bold">Current Tournament</h2>
          <div className="max-w-4xl mx-auto">
            <TournamentInfo {...tournamentInfo} />
          </div>
        </div>
      </section>
      
      {/* Top Players Section */}
      <section className="py-16 bg-chess-light/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-3xl font-bold">Top Players</h2>
            <Link to="/leaderboard">
              <Button variant="link" className="text-chess-accent hover:text-chess-accent/80">
                View Full Leaderboard
              </Button>
            </Link>
          </div>
          
          <LeaderboardTable players={topPlayers} showTiebreaker={true} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-serif text-3xl mb-10 font-bold">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-chess-light/30 hover:border-chess-accent/50 transition-all">
              <div className="w-12 h-12 bg-chess-accent/10 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-chess-accent">
                  <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path d="M14 15c0-.34.056-.668.152-.973H6a3 3 0 00-3 3v2h13.779A4.992 4.992 0 0114 15z" />
                  <path d="M17 14a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Player Dashboard</h3>
              <p className="text-muted-foreground">
                View your upcoming matches, tournament progress, and current standings all in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-chess-light/30 hover:border-chess-accent/50 transition-all">
              <div className="w-12 h-12 bg-chess-accent/10 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-chess-accent">
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Live Leaderboard</h3>
              <p className="text-muted-foreground">
                Real-time updates to tournament standings with accurate scoring and tiebreakers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-chess-light/30 hover:border-chess-accent/50 transition-all">
              <div className="w-12 h-12 bg-chess-accent/10 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-chess-accent">
                  <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                  <path d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Automatic Pairings</h3>
              <p className="text-muted-foreground">
                Intelligent match pairing using Swiss or Round Robin systems with board assignment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-chess-dark text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl mb-6 font-bold">Ready to Join?</h2>
          <p className="max-w-xl mx-auto mb-8 text-gray-300">
            Login to view your tournament progress, upcoming matches, and participate 
            in our chess events.
          </p>
          <Link to="/login">
            <Button className="bg-chess-accent hover:bg-chess-accent/90 text-chess-black font-medium">
              Player Login
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
