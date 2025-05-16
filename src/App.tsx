
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Suspense, lazy, useEffect } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PlayerDashboard from "./pages/PlayerDashboard";
import Leaderboard from "./pages/Leaderboard";
import PlayerLookup from "./pages/PlayerLookup";
import AdminDashboard from "./pages/AdminDashboard";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Loading component
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-chess-accent mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <LoadingComponent />;
  }
  
  // Check if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if profile is loaded and role is appropriate
  if (profile && profile.role !== 'admin' && profile.role !== 'superadmin') {
    console.log("User role doesn't match admin, redirecting to player dashboard", profile);
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const ProtectedPlayerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <LoadingComponent />;
  }
  
  // Check if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is an admin, redirect to admin dashboard
  if (profile && (profile.role === 'admin' || profile.role === 'superadmin')) {
    console.log("User is admin, redirecting to admin dashboard", profile);
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={
      <ProtectedPlayerRoute>
        <PlayerDashboard />
      </ProtectedPlayerRoute>
    } />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/player-lookup" element={<PlayerLookup />} />
    <Route path="/player-lookup/:playerId" element={<PlayerLookup />} />
    <Route path="/admin" element={
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    } />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
