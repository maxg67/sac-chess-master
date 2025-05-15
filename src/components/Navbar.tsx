
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-chess-dark text-white px-4 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-chess-accent rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 5.5a3 3 0 11-6 0 3 3 0 016 0zM15.75 14c-3.314 0-6 1.8-6 4v2h12v-2c0-2.2-2.686-4-6-4z" />
              <path d="M2 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zM6.5 14c-2.19 0-4 1.21-4 2.7v2.3h8v-2.3c0-1.49-1.81-2.7-4-2.7z" />
            </svg>
          </div>
          <span className="text-xl font-serif font-bold">Chess At SAC</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-chess-accent transition-colors">Home</Link>
          <Link to="/leaderboard" className="hover:text-chess-accent transition-colors">Leaderboard</Link>
          <Link to="/player-lookup" className="hover:text-chess-accent transition-colors">Player Lookup</Link>
          
          {user ? (
            <>
              <Link 
                to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} 
                className="hover:text-chess-accent transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-white">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white">
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-chess-dark py-4 px-4 absolute w-full z-50 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="hover:text-chess-accent transition-colors" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/leaderboard" className="hover:text-chess-accent transition-colors" onClick={toggleMobileMenu}>Leaderboard</Link>
            <Link to="/player-lookup" className="hover:text-chess-accent transition-colors" onClick={toggleMobileMenu}>Player Lookup</Link>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/dashboard'} 
                  className="hover:text-chess-accent transition-colors"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={toggleMobileMenu}>
                <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
