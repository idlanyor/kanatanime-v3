import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
        </svg>
      )
    },
    { 
      name: 'Ongoing', 
      path: '/ongoing', 
      icon: (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      )
    },
    { 
      name: 'Donghua', 
      path: '/donghua', 
      icon: (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      )
    },
    { 
      name: 'List', 
      path: '/list', 
      icon: (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.58 8.44L11.5 4.36L7.42 8.44l4.08 4.08l4.08-4.08zM11.5 4.36l-4.08 4.08l4.08 4.08l4.08-4.08l-4.08-4.08zM19.66 12.52l-4.08-4.08l-4.08 4.08l4.08 4.08l4.08-4.08zM11.5 12.52l-4.08-4.08l-4.08 4.08l4.08 4.08l4.08-4.08zM7.42 16.6l-4.08-4.08l4.08 4.08l4.08-4.08L7.42 16.6z"/>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5 12.52v8M7.42 16.6h8"/>
        </svg>
      )
    },
        {
          name: 'Movie',
          path: '/movies',
          icon: (
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          )
        },    { 
      name: 'Schedule', 
      path: '/schedule', 
      icon: (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>
      )
    },
    { 
      name: 'Favs', 
      path: '/favorites', 
      icon: (
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 z-[2100] w-full h-16 bg-white border-t-8 border-black shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
      <div className="grid h-full grid-cols-6 mx-auto font-normal heading-font tracking-tighter">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`inline-flex flex-col items-center justify-center transition-all ${
              isActive(item.path)
                ? 'bg-[var(--neo-coral)] text-white'
                : 'text-black hover:bg-[var(--neo-yellow)]'
            }`}
          >
            <div className={`mb-0.5 transition-transform ${isActive(item.path) ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[9px] uppercase">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
