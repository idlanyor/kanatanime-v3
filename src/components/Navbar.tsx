import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0c0c0c]/80 backdrop-blur-md border-b-8 border-black px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link 
          to="/"
          className="group text-2xl md:text-4xl font-black oswald italic cursor-pointer flex items-center gap-1 shrink-0"
        >
          <div className="relative">
            <span className="bg-[#FFCC00] text-black px-2 border-4 border-black inline-block transform -rotate-3 group-hover:rotate-0 transition-transform duration-200">KANATANIME</span>
            <div className="absolute -top-1 -right-1 w-full h-full border-4 border-black bg-[#FF3B30] -z-10 transform translate-x-1 translate-y-1"></div>
          </div>
          <span className="text-[#FF3B30] underline decoration-8 underline-offset-8 decoration-black group-hover:text-white transition-colors">V3</span>
        </Link>
        
        <div className="hidden lg:flex gap-1 items-center font-black uppercase oswald text-xl">
          {[
            { name: 'home', path: '/' },
            { name: 'list', path: '/list' },
            { name: 'ongoing', path: '/ongoing' },
            { name: 'donghua', path: '/donghua' },
            { name: 'schedule', path: '/schedule' },
            { name: 'movie', path: '/movies' },
          ].map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className={`px-4 py-1 transition-all border-4 border-transparent hover:border-black hover:bg-[#FFCC00] hover:text-black ${
                isActive(item.path) 
                ? 'bg-[#FF3B30] text-white border-black transform -rotate-2' 
                : 'text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="SEARCH..." 
             className="w-full bg-white border-4 border-black p-2 px-4 font-black oswald text-black placeholder:text-gray-400 outline-none focus:bg-[#FFCC00] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] text-xs md:text-base"
           />
           <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-black text-sm md:text-base">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
           </button>
        </form>
      </div>
      
      {/* Decorative bottom element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,#FFCC00,#FFCC00_10px,#000_10px,#000_20px)] opacity-50"></div>
    </nav>
  );
};

export default Navbar;

