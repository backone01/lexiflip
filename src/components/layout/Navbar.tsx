
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Home } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between h-16 px-6 border-b bg-background/80 backdrop-blur-md z-50">
      <NavLink to="/" className="flex items-center gap-2">
        <Book className="w-6 h-6 text-primary" />
        <span className="text-xl font-semibold">LexiFlip</span>
      </NavLink>
      
      <nav className="flex items-center space-x-1">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `nav-link flex items-center gap-1 ${isActive ? 'active' : ''}`
          }
          end
        >
          <Home className="w-4 h-4" />
          <span>Beranda</span>
        </NavLink>
        
        <NavLink 
          to="/practice/flashcard" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          Latihan
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
