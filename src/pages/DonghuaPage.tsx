import React, { useEffect, useState } from 'react';
import { Anime } from '../types';
import Loader from '../components/Loader';
import AnimeCard from '../components/AnimeCard';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

const DonghuaPage = () => {
  const [donghuaList, setDonghuaList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const mapApiData = (data: any[]): Anime[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.image_url || '',
      banner: item.image_url || '',
      episode: item.latest_episode ? `EP ${item.latest_episode}` : '??',
      status: 'ONGOING',
      year: item.date_created ? new Date(item.date_created).getFullYear() : 2026,
      rating: item.rating ? parseFloat(item.rating) : 0,
      genre: ['Donghua'],
      synopsis: `Added: ${item.date_created ? new Date(item.date_created).toLocaleDateString() : 'Recently'}.`,
      likes: `${Math.floor(Math.random() * 50) + 1}K`
    }));
  };

  useEffect(() => {
    const fetchDonghua = async () => {
      try {
        setLoading(true);
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/donghua?page=${page}`);
        const json = await res.json();
        
        if (json.status === 'success' && json.data?.data) {
          const list = json.data.data;
          setDonghuaList(mapApiData(list));
          setHasNextPage(list.length >= 10);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonghua();
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) return <Loader message="RETRIVING DONGHUA ARCHIVES..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="bg-purple-600 border-8 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 font-black text-8xl -translate-y-4">DONGHUA</div>
        <h1 className="text-4xl md:text-7xl font-black oswald text-white italic relative z-10">DONGHUA SERIES</h1>
        <p className="text-lg md:text-2xl font-bold oswald text-black bg-[#FFCC00] px-2 py-1 inline-block mt-4 relative z-10 uppercase">THE SPIRIT OF CHINA</p>
      </header>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {donghuaList.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-4 pb-10">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-8 py-3 font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${page === 1 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-white hover:bg-[#FFCC00] text-black'}`}
        >
          PREV
        </button>
        <div className="bg-black text-white px-6 py-3 border-4 border-black font-black oswald text-xl flex items-center justify-center min-w-[80px]">
          {page}
        </div>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!hasNextPage}
          className={`px-8 py-3 font-black oswald border-4 border-black shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all ${!hasNextPage ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#FF3B30] text-white hover:bg-red-600'}`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default DonghuaPage;
