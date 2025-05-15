
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-chess-dark text-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Chess At SAC</h3>
            <p className="text-sm text-gray-300">
              The premier chess tournament management platform designed for chess enthusiasts 
              and tournament organizers.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-chess-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-300 hover:text-chess-accent transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/player-lookup" className="text-gray-300 hover:text-chess-accent transition-colors">
                  Player Lookup
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-chess-accent transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-semibold mb-3">Contact Us</h4>
            <p className="text-sm text-gray-300 mb-2">
              Have questions about the tournament or platform?
            </p>
            <p className="text-sm text-gray-300">
              Email: <a href="mailto:info@chessatsac.com" className="text-chess-accent hover:underline">
                info@chessatsac.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} Chess At SAC. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-gray-400 hover:text-chess-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-gray-400 hover:text-chess-accent transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
