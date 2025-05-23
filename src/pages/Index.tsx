
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import TournamentInfo from '@/components/TournamentInfo';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define tournament data interface to match the TournamentInfo props
interface TournamentData {
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

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrationLink, setRegistrationLink] = useState('');
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['tournament_registration_link', 'tournament_registration_enabled']);

        if (settingsError) throw settingsError;

        // Get active tournament info
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*, players:players!tournament_id(*)')
          .eq('is_active', true)
          .single();

        if (tournamentError && tournamentError.code !== 'PGRST116') {
          throw tournamentError;
        }

        // Process settings data
        const settingsMap = settingsData?.reduce((acc: Record<string, string>, item) => {
          acc[item.setting_key] = item.setting_value || '';
          return acc;
        }, {});

        if (settingsMap) {
          setRegistrationLink(settingsMap.tournament_registration_link || '');
          setRegistrationEnabled(settingsMap.tournament_registration_enabled === 'true');
        }

        // Process tournament data
        if (tournamentData) {
          const playerCount = tournamentData.players ? tournamentData.players.length : 0;
          const location = tournamentData.location || 'TBD';
          
          setTournamentData({
            name: tournamentData.name,
            description: tournamentData.description || 'SAC Chess Tournament',
            venue: location,
            startDate: new Date(tournamentData.start_date).toLocaleDateString(),
            endDate: new Date(tournamentData.end_date).toLocaleDateString(),
            currentRound: tournamentData.current_round,
            totalRounds: tournamentData.total_rounds,
            totalPlayers: playerCount,
            contactEmail: 'chess@sac.edu'
          });
        } else {
          // Default tournament data if none is found
          setTournamentData({
            name: 'SAC Chess Tournament',
            description: 'Welcome to the SAC Chess Tournament',
            venue: 'Santa Ana College',
            startDate: 'TBD',
            endDate: 'TBD',
            currentRound: 0,
            totalRounds: 5,
            totalPlayers: 0,
            contactEmail: 'chess@sac.edu'
          });
        }
      } catch (error) {
        console.error('Error loading home page data:', error);
        toast.error('Failed to load tournament information');
        
        // Set default data if there's an error
        setTournamentData({
          name: 'SAC Chess Tournament',
          description: 'Welcome to the SAC Chess Tournament',
          venue: 'Santa Ana College',
          startDate: 'TBD',
          endDate: 'TBD',
          currentRound: 0,
          totalRounds: 5,
          totalPlayers: 0,
          contactEmail: 'chess@sac.edu'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserFlow = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-chess-dark text-white py-16 md:py-24 chess-pattern">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Chess at SAC
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Welcome to the official tournament management system for SAC chess tournaments
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
              <Button 
                size="lg" 
                onClick={handleUserFlow}
                className="bg-chess-accent hover:bg-chess-accent/90 text-white"
              >
                {user ? 'Go to Dashboard' : 'Login to Account'}
              </Button>
              
              {registrationEnabled && registrationLink && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-chess-dark"
                  asChild
                >
                  <a href={registrationLink} target="_blank" rel="noopener noreferrer">
                    Register for Tournament
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">Current Tournament</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-chess-accent"></div>
            </div>
          ) : tournamentData ? (
            <TournamentInfo {...tournamentData} />
          ) : (
            <p className="text-center text-gray-500">No active tournament found.</p>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/leaderboard">
              <Button className="bg-chess-dark hover:bg-chess-black">
                View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-12">Tournament Management System</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-serif mb-3">Real-time Updates</h3>
              <p className="text-gray-600">Track tournament progress, pairings, and results as they happen</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-serif mb-3">Fair Pairings</h3>
              <p className="text-gray-600">Advanced Swiss pairing system ensures balanced and fair matchups</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-serif mb-3">Easy Management</h3>
              <p className="text-gray-600">Administrative tools make organizing tournaments simple and efficient</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
