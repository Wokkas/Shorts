import React from 'react';
import { Zap, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Shorts<span className="text-red-500">Genius</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {/* Simple nav or empty if just a downloader */}
        </nav>

        <button className="md:hidden p-2 text-gray-400 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;