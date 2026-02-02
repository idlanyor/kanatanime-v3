import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Anime } from '../types';
import Loader from '../components/Loader';
import AnimeCard from '../components/AnimeCard';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

const SearchPage = () => {
  const { query } = useParams<{ query: string }>();
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  const mapApiData = (data: any[]): Anime[] => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      thumbnail: item.image_url || '',
      banner: item.image_url || '',
      episode: item.latest_episode ? `EP ${item.latest_episode}` : '??',
      status: 'ONGOING', // Default
      year: item.date_created ? new Date(item.date_created).getFullYear() : new Date().getFullYear(),
      rating: item.rating ? parseFloat(item.rating) : 0,
      genre: [item.type || 'Anime'],
      synopsis: item.broadcast ? `Broadcast: ${item.broadcast}` : `Released: ${item.date_created ? new Date(item.date_created).toLocaleDateString() : 'Recently'}`,
      likes: `${Math.floor(Math.random() * 50) + 1}K`
    }));
  };

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/search?q=${encodeURIComponent(query)}&page=1`);
        const json = await res.json();

        if (json.status === 'success' && json.data?.data) {
          setResults(mapApiData(json.data.data));
        }
      } catch (error) {
        console.error('Search Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  if (loading) return <Loader message={`SCOUTING FOR "${query?.toUpperCase()}"...`} />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="bg-white border-8 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(255,204,0,1)] transform -rotate-1">
        <h1 className="text-4xl md:text-7xl font-black oswald text-black italic leading-none">
          SEARCH: <span className="text-[#FF3B30] underline decoration-8">{query?.toUpperCase()}</span>
        </h1>
        <p className="text-lg md:text-2xl font-bold oswald text-white bg-black px-2 py-1 inline-block mt-4 uppercase">
          {results.length} INTEL RECORD(S) FOUND
        </p>
      </header>

      <section>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {results.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-8 border-dashed border-black">
             <h2 className="text-5xl font-black oswald text-gray-500">NO RESULTS FOUND</h2>
             <p className="font-bold uppercase mt-4">The target escaped our radar.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;