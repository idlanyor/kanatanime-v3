import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScheduleDay } from '../types';
import Loader from '../components/Loader';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/schedule`);
        const json = await res.json();
        
        if (json.status === 'success' && Array.isArray(json.data)) {
          setSchedule(json.data);
        }
      } catch (err) {
        console.error('Schedule Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <Loader message="SYNCING SCHEDULE..." />;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12">
      <h1 className="text-4xl md:text-7xl text-center font-black oswald text-white italic relative z-10 mb-12">
        <span className="bg-[#FFCC00] text-black px-4 transform -rotate-2 inline-block border-4 border-black shadow-[8px_8px_0px_0px_white]">WEEKLY SCHEDULE</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {schedule.map((day, idx) => (
          <div key={day.day} className="bg-white h-[500px] border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <h2 className="text-3xl font-black oswald bg-black text-white p-4 text-center uppercase tracking-wider border-b-8 border-black">
              {day.day}
            </h2>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {day.anime_list.map((anime) => (
                <div 
                  key={anime.slug}
                  onClick={() => navigate(`/detail/${anime.slug}`)}
                  className="group cursor-pointer flex items-center gap-3 border-4 border-black p-2 hover:bg-[#FFCC00] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                >
                   <div className="w-12 h-16 shrink-0 border-2 border-black overflow-hidden bg-black">
                      <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                   </div>
                   <p className="font-bold text-black text-xs md:text-sm line-clamp-2 leading-tight uppercase group-hover:text-black">
                     {anime.title}
                   </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
