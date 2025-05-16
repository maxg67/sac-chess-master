import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import LeaderboardTable from '@/components/LeaderboardTable';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

// Sample player data
const allPlayers = [
  { id: 'p1', name: 'Magnus Johnson', score: 2, wins: 2, draws: 0, losses: 0, tiebreaker: 4 },
  { id: 'p2', name: 'Anna Karlson', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 3.5 },
  { id: 'p3', name: 'Robert Fischer Jr.', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 3 },
  { id: 'p4', name: 'John Player', score: 1.5, wins: 1, draws: 1, losses: 0, tiebreaker: 2.75 },
  { id: 'p5', name: 'Maria Chen', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 2.5 },
  { id: 'p6', name: 'Hikaru Smith', score: 1, wins: 1, draws: 0, losses: 1, tiebreaker: 2 },
  // More players...
];

// Sample matches for round 3
const round3Matches = [
  { id: 'm1', player1: { id: 'p1', name: 'Magnus Johnson' }, player2: { id: 'p4', name: 'John Player' }, board: 1, result: null },
  { id: 'm2', player1: { id: 'p2', name: 'Anna Karlson' }, player2: { id: 'p3', name: 'Robert Fischer Jr.' }, board: 2, result: null },
  { id: 'm3', player1: { id: 'p5', name: 'Maria Chen' }, player2: { id: 'p6', name: 'Hikaru Smith' }, board: 3, result: null },
  // More matches...
];

// Past rounds results
const pastRounds = [
  { 
    number: 1, 
    matches: [
      { id: 'pm1', player1: { id: 'p1', name: 'Magnus Johnson' }, player2: { id: 'p5', name: 'Maria Chen' }, result: '1-0' },
      { id: 'pm2', player1: { id: 'p2', name: 'Anna Karlson' }, player2: { id: 'p6', name: 'Hikaru Smith' }, result: '1-0' },
      { id: 'pm3', player1: { id: 'p3', name: 'Robert Fischer Jr.' }, player2: { id: 'p4', name: 'John Player' }, result: '0-1' },
    ]
  },
  {
    number: 2,
    matches: [
      { id: 'pm4', player1: { id: 'p1', name: 'Magnus Johnson' }, player2: { id: 'p6', name: 'Hikaru Smith' }, result: '1-0' },
      { id: 'pm5', player1: { id: 'p4', name: 'John Player' }, player2: { id: 'p2', name: 'Anna Karlson' }, result: '½-½' },
      { id: 'pm6', player1: { id: 'p3', name: 'Robert Fischer Jr.' }, player2: { id: 'p5', name: 'Maria Chen' }, result: '½-½' },
    ]
  }
];

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('players');
  const [selectedRound, setSelectedRound] = useState('3');
  const [matches, setMatches] = useState(round3Matches);
  
  // No need for additional auth checking since we use ProtectedAdminRoute

  const handleResultChange = (matchId: string, result: string) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, result };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const handleSaveResults = () => {
    // Here you would normally submit to API
    toast.success("Match results saved successfully!");
  };

  const handleGeneratePairings = () => {
    toast.success("Pairings for Round 4 generated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 chess-pattern pb-12">
      <div className="bg-chess-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl">Admin Dashboard</h1>
              <p className="text-gray-300">
                Welcome, {profile?.name || 'Admin'} | <span className="capitalize">{profile?.role}</span>
              </p>
            </div>
            {profile?.role === 'superadmin' && (
              <Badge className="bg-chess-accent hover:bg-chess-accent/90">
                Super Admin Access
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="rounds">Round Management</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="settings" disabled={profile?.role !== 'superadmin'}>
              Settings
              {profile?.role !== 'superadmin' && <span className="ml-1 text-xs opacity-70">(Restricted)</span>}
            </TabsTrigger>
          </TabsList>
          
          {/* Players Tab */}
          <TabsContent value="players" className="animate-fade-in space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Player Management</CardTitle>
                  <CardDescription>View and manage tournament participants</CardDescription>
                </div>
                {profile?.role === 'superadmin' && (
                  <Button className="bg-chess-dark hover:bg-chess-black">
                    Add New Player
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Input placeholder="Search players..." className="max-w-sm" />
                </div>
                <LeaderboardTable players={allPlayers} showTiebreaker={true} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Round Management Tab */}
          <TabsContent value="rounds" className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Round Management</CardTitle>
                <CardDescription>Manage pairings and board assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Current Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div 
                          className="bg-chess-accent h-2.5 rounded-full" 
                          style={{ width: '33%' }}
                        ></div>
                      </div>
                      <span className="whitespace-nowrap text-sm font-medium">
                        Round 2 of 6 Complete
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium whitespace-nowrap">Select Round:</span>
                    <Select value={selectedRound} onValueChange={setSelectedRound}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select Round" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Round 3 (Current)</SelectItem>
                        <SelectItem value="4" disabled>Round 4 (Not Started)</SelectItem>
                        <SelectItem value="2">Round 2 (Complete)</SelectItem>
                        <SelectItem value="1">Round 1 (Complete)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Round 3 Pairings</h3>
                  <div className="space-y-3">
                    {matches.map(match => (
                      <Card key={match.id} className="border-chess-light/30 overflow-hidden">
                        <div className="bg-chess-dark/5 px-4 py-2 flex justify-between items-center">
                          <span className="font-medium">Board {match.board}</span>
                          <Select 
                            value={match.result || ''} 
                            onValueChange={(value) => handleResultChange(match.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Result" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-0">1-0 (White wins)</SelectItem>
                              <SelectItem value="½-½">½-½ (Draw)</SelectItem>
                              <SelectItem value="0-1">0-1 (Black wins)</SelectItem>
                              <SelectItem value="1-0*">1-0* (White wins by default)</SelectItem>
                              <SelectItem value="0-1*">0-1* (Black wins by default)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <CardContent className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs">W</span>
                            <span>{match.player1.name}</span>
                          </div>
                          <div className="text-xl font-semibold">vs</div>
                          <div className="flex items-center gap-2">
                            <span>{match.player2.name}</span>
                            <span className="w-6 h-6 rounded-full bg-chess-black text-white border border-gray-300 flex items-center justify-center text-xs">B</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={handleSaveResults} className="bg-chess-success hover:bg-chess-success/90">
                      Save Results
                    </Button>
                    <Button onClick={handleGeneratePairings} className="bg-chess-dark hover:bg-chess-black">
                      Generate Pairings for Next Round
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Results</CardTitle>
                <CardDescription>View results from completed rounds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {pastRounds.map((round) => (
                    <div key={round.number} className="space-y-4">
                      <h3 className="font-serif text-xl font-bold">Round {round.number} Results</h3>
                      <div className="space-y-3">
                        {round.matches.map(match => (
                          <Card key={match.id} className="border-chess-light/30">
                            <CardContent className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs">W</span>
                                <span>{match.player1.name}</span>
                              </div>
                              <div className="bg-chess-light/20 px-4 py-1 rounded-full text-lg font-mono">
                                {match.result}
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{match.player2.name}</span>
                                <span className="w-6 h-6 rounded-full bg-chess-black text-white border border-gray-300 flex items-center justify-center text-xs">B</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab (Super Admin Only) */}
          <TabsContent value="settings" className="animate-fade-in space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Settings</CardTitle>
                <CardDescription>
                  Configure tournament parameters and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Tournament Name</Label>
                      <Input defaultValue="Chess At SAC Summer Championship" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Total Rounds</Label>
                      <Input defaultValue="6" type="number" min="1" max="15" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Pairing System</Label>
                      <Select defaultValue="swiss">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select pairing system" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="swiss">Swiss System</SelectItem>
                          <SelectItem value="roundrobin">Round Robin</SelectItem>
                          <SelectItem value="knockout">Knockout</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Time Control</Label>
                      <Input defaultValue="10+0" placeholder="e.g. 10+0" className="col-span-3" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button className="bg-chess-dark hover:bg-chess-black">
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>
                  Manage administrator accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="mb-6">
                  Add New Admin
                </Button>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-chess-dark/10">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Super Admin</TableCell>
                        <TableCell>superadmin@example.com</TableCell>
                        <TableCell>Super Admin</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" disabled>Edit</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Admin User</TableCell>
                        <TableCell>admin@example.com</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// We need to add a Label component
const Label = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <label className={`text-sm font-medium ${className || ''}`}>
    {children}
  </label>
);

// Also need to add Table components
const Table = ({ children }: { children: React.ReactNode }) => <table className="w-full">{children}</table>;
const TableHeader = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
const TableBody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
const TableRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <tr className={`border-b hover:bg-gray-50 ${className || ''}`}>{children}</tr>
);
const TableHead = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <th className={`text-left p-3 ${className || ''}`}>{children}</th>
);
const TableCell = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <td className={`p-3 ${className || ''}`}>{children}</td>
);

export default AdminDashboard;
