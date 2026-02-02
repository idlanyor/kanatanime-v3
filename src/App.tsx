import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faFacebook, faGithub, faThreads } from '@fortawesome/free-brands-svg-icons';
import { MOCK_ANIME } from './constants';
import { Anime } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OngoingPage from './pages/OngoingPage';
import MoviesPage from './pages/MoviesPage';
import DonghuaPage from './pages/DonghuaPage';
import SearchPage from './pages/SearchPage';
import AnimeDetail from './pages/AnimeDetail';
import WatchPage from './pages/WatchPage';
import SchedulePage from './pages/SchedulePage';
import TrendingPage from './pages/TrendingPage';
import SeriesListPage from './pages/SeriesListPage';
import BottomNav from './components/BottomNav';
import GenrePage from './pages/GenrePage';
import GenreDetailPage from './pages/GenreDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import SocialMediaPopup from './components/SocialMediaPopup';
// import ContextMenu from './components/ContextMenu';
import FavoritesPage from './pages/FavoritesPage';
import AuthorPage from './pages/AuthorPage';
import { API_BASE_URL, ANIMEPLAY_API_BASE_URL } from './constants';
import { authenticatedFetch } from './utils/api';

export default function App() {
  const [trendingList, setTrendingList] = useState<Anime[]>([]);
  const [movieList, setMovieList] = useState<Anime[]>([]);
  const [completedList, setCompletedList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  const mapApiData = (data: any[]): Anime[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.image_url || '',
      banner: item.image_url || '',
      episode: item.latest_episode ? `EP ${item.latest_episode}` : '??',
      status: 'ONGOING', // Defaulting for now
      year: item.date_created ? new Date(item.date_created).getFullYear() : new Date().getFullYear(),
      rating: item.rating ? parseFloat(item.rating) : 0,
      genre: ['Anime'], 
      synopsis: `Watch ${item.title} on Kanatanime V3.`,
      likes: `${Math.floor(Math.random() * 50) + 1}K`,
      type: item.type
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/home`);
        const json = await res.json();

        if (json.status === 'success' && json.data) {
          const trending = json.data.find((d: any) => d.type === 'all_trending')?.data || [];
          const movies = json.data.find((d: any) => d.type === 'all_movies')?.data || [];
          const completed = json.data.find((d: any) => d.type === 'all_completed')?.data || [];
          
          setTrendingList(mapApiData(trending));
          setMovieList(mapApiData(movies));
          setCompletedList(mapApiData(completed));
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setTrendingList(MOCK_ANIME);
        setMovieList(MOCK_ANIME);
        setCompletedList(MOCK_ANIME);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-[#FFCC00] selection:text-black overflow-x-hidden">
      <SocialMediaPopup />
      {/* <ContextMenu /> */}
      <Navbar />
      <main className="pt-28 pb-24 md:pb-20 lg:pb-20">
        <Routes>
          <Route path="/" element={
            <Home 
              trending={trendingList} 
              movies={movieList} 
              completed={completedList} 
              loading={loading} 
            />
          } />
          <Route path="/ongoing" element={<OngoingPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/donghua" element={<DonghuaPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/list" element={<SeriesListPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/genre" element={<GenrePage />} />
          <Route path="/genre/:genreId" element={<GenreDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/detail/:slug" element={<AnimeDetail />} />
          <Route path="/watch/:slug/:episodeSlug" element={<WatchPage />} />
          <Route path="/episode/:episodeSlug" element={<WatchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <BottomNav />

      <footer className="mt-20 bg-black border-t-8 border-[#FF3B30] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 text-[60px] md:text-[120px] font-black opacity-10 transform translate-x-10 -translate-y-10 leading-none pointer-events-none oswald">
          KANATANIME V3
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          <div className="space-y-4">
            <div className="text-4xl font-black oswald italic flex items-center gap-2">
              <span className="bg-[#FFCC00] text-black px-2 border-2 border-black transform -rotate-2 oswald">KANATANIME</span>
              <span className="text-[#FF3B30] underline decoration-4 underline-offset-4 oswald">V3</span>
            </div>
            <p className="font-bold text-gray-400">The world's most aggressive anime experience. Built for the fans.</p>
          </div>
          <div>
            <h4 className="font-black oswald text-xl mb-4 text-[#FFCC00]">NAVIGATE</h4>
            <ul className="space-y-2 font-bold uppercase text-sm">
              <li><Link to="/" className="hover:text-[#FF3B30] cursor-pointer">Home</Link></li>
              <li><Link to="/movies" className="hover:text-[#FF3B30] cursor-pointer">Movies</Link></li>
              <li><Link to="/author" className="hover:text-[#FF3B30] cursor-pointer">Meet the Team</Link></li>
              <li className="hover:text-[#FF3B30] cursor-pointer">Discord</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black oswald text-xl mb-4 text-[#FFCC00]">FOLLOW US</h4>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: faWhatsapp, href: "https://whatsapp.com/channel/0029VagADOLLSmbaxFNswH1m", color: "bg-[#25D366]" },
                { icon: faInstagram, href: "https://instagram.com/kang.potokopi", color: "bg-[#E4405F]" },
                { icon: faFacebook, href: "https://facebook.com/kang.potokopi", color: "bg-[#1877F2]" },
                { icon: faGithub, href: "https://github.com/idlanyor", color: "bg-[#333] text-white" },
                { icon: faThreads, href: "https://threads.net/kang.potokopi", color: "bg-[#000] text-white" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-10 h-10 border-4 border-white flex items-center justify-center font-black hover:bg-[#FFCC00] hover:text-black cursor-pointer shadow-[2px_2px_0px_0px_white] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${social.color}`}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
          <div className="bg-[#FFCC00] p-4 border-4 border-white text-black shadow-[8px_8px_0px_0px_white]">
            <h4 className="font-black oswald text-lg mb-2">JOIN THE SQUAD</h4>
            <div className="flex">
              <input type="text" className="bg-white border-2 border-black p-2 w-full outline-none font-bold text-sm" placeholder="Email" />
              <button className="bg-black text-white p-2 border-2 border-black border-l-0 font-black oswald px-4 hover:bg-red-600 transition-colors">GO</button>
            </div>
          </div>
        </div>

        {/* Disclaimer & DMCA Section */}
        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-white/5 border-2 border-dashed border-gray-700 p-6">
            <h4 className="font-black oswald text-xl text-[#FF3B30] mb-3 uppercase italic tracking-widest">⚠️ DISCLAIMER</h4>
            <p className="text-xs font-bold text-gray-300 leading-relaxed uppercase">
              Kanatanime V3 is a content aggregator/scraper. We do not host, store, or upload any video files on our servers. 
              All streaming content is provided by non-affiliated third-party providers. Kanatanime V3 is not responsible for 
              the accuracy, compliance, copyright, legality, or decency of the content served from these external sources.
            </p>
          </div>
          <div className="bg-white/5 border-2 border-dashed border-gray-700 p-6">
            <h4 className="font-black oswald text-xl text-[#FFCC00] mb-3 uppercase italic tracking-widest">⚖️ DMCA NOTICE</h4>
            <p className="text-xs font-bold text-gray-300 leading-relaxed uppercase">
              We respect intellectual property rights. If you believe your copyrighted material is being linked through our platform 
              without authorization, please contact the original hosting provider for removal. As we do not host the files, 
              removal from the source will automatically update our index. For removal requests from our index, please email our team.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t-2 border-gray-800 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          © 2023 - {new Date().getFullYear()} KANATANIME V3 - NO RIGHTS RESERVED. BEYOND BOLD.
        </div>
      </footer>
    </div>
  );
}