import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

interface GroupedList {
  letter: string;
  items: { id: string; title: string }[];
}

const SeriesListPage = () => {
  const [groupedList, setGroupedList] = useState<GroupedList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/list-mode`);
        const json = await res.json();
        
        if (json.status === 'success' && Array.isArray(json.data)) {
          setGroupedList(json.data);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
    window.scrollTo(0, 0);
  }, []);

  const filteredList = groupedList.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  if (loading) return <Loader message="DECRYPTING FULL DATABASE..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <header className="bg-black border-8 border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_#FFCC00] transform -rotate-1 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 opacity-10 font-black text-8xl -translate-y-4 uppercase select-none">Catalog</div>
        <h1 className="text-4xl md:text-7xl font-black oswald italic relative z-10 uppercase">Series Catalog</h1>
        <p className="text-lg md:text-2xl font-bold oswald text-[#FFCC00] mt-4 relative z-10">ALPHABETICAL ARCHIVE</p>
        
        <div className="relative z-10 mt-8">
          <input 
            type="text" 
            placeholder="SEARCH_BY_TITLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 bg-white border-4 border-black p-4 font-black oswald text-black outline-none shadow-[8px_8px_0px_0px_#FF3B30] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
          />
        </div>
      </header>

      {/* A-Z Quick Jump */}
      <div className="flex flex-wrap justify-center gap-2 relative z-10">
        {groupedList.map((group, idx) => (
          <a 
            key={`${group.letter}-${idx}`} 
            href={`#letter-${group.letter}`}
            className="w-10 h-10 flex items-center justify-center bg-white border-4 border-black text-black font-black oswald hover:bg-[#FFCC00] transition-colors shadow-[4px_4px_0px_0px_black]"
          >
            {group.letter}
          </a>
        ))}
      </div>

      <section className="space-y-12">
        {filteredList.length > 0 ? (
          filteredList.map((group, gIdx) => (
            <div key={`${group.letter}-${gIdx}`} id={`letter-${group.letter}`} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#FF3B30] text-white w-16 h-16 flex items-center justify-center border-4 border-black text-4xl font-black oswald shadow-[6px_6px_0px_0px_black]">
                  {group.letter}
                </div>
                <div className="h-2 flex-1 bg-black"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item, iIdx) => (
                  <div 
                    key={`${item.id}-${gIdx}-${iIdx}`}
                    onClick={() => navigate(`/detail/${item.id}`)}
                    className="group cursor-pointer bg-white border-4 border-black p-4 flex items-center gap-4 hover:bg-[#FFCC00] transition-all transform hover:-translate-y-1 shadow-[6px_6px_0px_0px_black] hover:shadow-none"
                  >
                    <div className="w-2 h-8 bg-black group-hover:bg-[#FF3B30] transition-colors"></div>
                    <span className="font-black oswald text-sm md:text-base uppercase truncate text-black">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-8 border-dashed border-black">
             <h2 className="text-5xl font-black oswald text-gray-500">NO RECORDS MATCHED</h2>
          </div>
        )}
      </section>
    </div>
  );
};

export default SeriesListPage;

