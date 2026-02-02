import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import VideoPlayer from '../components/VideoPlayer';
import { DetailedAnime } from '../types';
import { ANIMEPLAY_API_BASE_URL } from '../constants';
import { authenticatedFetch } from '../utils/api';
import { sortEpisodes } from '../utils/episode';

interface StreamData {
  id: string;
  quality: string;
  streaming_url: string;
  download_url: string;
  file_size: number;
}

const WatchPage = () => {
  const { slug, episodeSlug: epSlugParam } = useParams<{ slug: string, episodeSlug: string }>();
  const episodeSlug = slug && !epSlugParam ? slug : epSlugParam; // Handle /episode/:slug case
  const navigate = useNavigate();
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [animeDetail, setAnimeDetail] = useState<DetailedAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingEpisode, setFetchingEpisode] = useState(false);
  const [currentStream, setCurrentStream] = useState<StreamData | null>(null);
  const activeEpisodeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [episodeSlug, animeDetail]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!episodeSlug) return;
      
      let currentSeriesSlug = slug;

      // Reset states if changing series
      if (animeDetail && slug && animeDetail.id !== slug) {
          setAnimeDetail(null);
          setLoading(true);
          setStreams([]);
          setCurrentStream(null);
      } else if (!animeDetail) {
          setLoading(true);
      } else {
          setFetchingEpisode(true);
      }

      try {
        // 1. Fetch Episode Stream Data
        const epRes = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/watch/${episodeSlug}`);
        const epJson = await epRes.json();
        
        if (epJson.status === 'success' && epJson.data?.data) {
          const streamList = epJson.data.data;
          const foundSeriesSlug = epJson.data.seriesSlug;
          setStreams(streamList);
          
          // Redirect to proper watch URL if we only have episodeSlug
          if (!slug && foundSeriesSlug) {
              navigate(`/watch/${foundSeriesSlug}/${episodeSlug}`, { replace: true });
              return; // Effect will re-run with slug
          }

          if (!currentSeriesSlug) currentSeriesSlug = foundSeriesSlug;

          // Try to match saved preferred quality
          const savedQuality = localStorage.getItem('preferred_quality');
          const matchedStream = streamList.find((s: any) => s.quality === savedQuality) || streamList[0];
          setCurrentStream(matchedStream || null);
        }

        // 2. Fetch Detail if missing or mismatched
        if (currentSeriesSlug && (!animeDetail || animeDetail.id !== currentSeriesSlug)) {
          const detailRes = await authenticatedFetch(`${ANIMEPLAY_API_BASE_URL}/detail/${currentSeriesSlug}`);
          const detailJson = await detailRes.json();

          if (detailJson.status === 'success' && detailJson.data?.data) {
            const d = detailJson.data.data;
            const detailed: DetailedAnime = {
              id: d.id,
              title: d.title,
              thumbnail: d.image_url,
              banner: d.image_url,
              episode: d.latest_episode?.toString() || '?',
              status: d.season_status?.toUpperCase() === 'COMPLETED' ? 'COMPLETED' : 'ONGOING',
              year: d.release_date ? new Date(d.release_date).getFullYear() : new Date().getFullYear(),
              rating: d.rating ? parseFloat(d.rating) : 0,
              genre: d.genres?.map((g: any) => g.genre.name) || [],
              synopsis: d.synopsis || 'No synopsis available.',
              info: {
                japanese: d.title_japanese,
                tipe: d.type,
                jumlah_episode: d.total_episode,
                studio: d.studio?.name || 'N/A',
                score: d.rating,
                producers: 'N/A',
                duration: d.duration,
                aired: d.release_date ? new Date(d.release_date).toLocaleDateString() : 'N/A',
              },
              episodes: sortEpisodes(d.episodes?.map((ep: any) => ({
                title: ep.title_indonesian || `Episode ${ep.number}`,
                episode: ep.number?.toString(),
                date: ep.date_created ? new Date(ep.date_created).toLocaleDateString() : 'Recently',
                slug: ep.id
              })) || [], 'oldest'),
            };
            setAnimeDetail(detailed);
          }
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
        setFetchingEpisode(false);
      }
    };

    fetchAllData();
    window.scrollTo(0, 0);
  }, [slug, episodeSlug]);


  const getAdjacentEpisodes = () => {
    if (!animeDetail || !animeDetail.episodes || !episodeSlug) return { prev: null, next: null };
    
    const list = animeDetail.episodes; // Already sorted oldest first
    const currentIndex = list.findIndex(ep => ep.slug === episodeSlug);
    
    if (currentIndex === -1) return { prev: null, next: null };

    return {
      prev: currentIndex > 0 ? list[currentIndex - 1] : null,
      next: currentIndex < list.length - 1 ? list[currentIndex + 1] : null
    };
  };

  const { prev, next } = getAdjacentEpisodes();

  if (loading && !animeDetail) return <Loader message="DECODING STREAM SIGNAL..." />;

  const currentEpisode = animeDetail?.episodes.find(ep => ep.slug === episodeSlug);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8 pb-20">

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="relative">
              <div className="aspect-video bg-black border-8 border-black shadow-[16px_16px_0px_0px_var(--neo-coral)] relative overflow-hidden z-10 group">
                <VideoPlayer 
                  episodeId={episodeSlug}
                  src={currentStream?.streaming_url} 
                  title={animeDetail?.title}
                  qualities={streams}
                  currentQuality={currentStream?.quality}
                  onQualityChange={(stream) => {
                    setCurrentStream(stream);
                    localStorage.setItem('preferred_quality', stream.quality);
                  }}
                  onEnded={() => {
                    if (next) {
                      navigate(`/watch/${slug}/${next.slug}`);
                    }
                  }}
                />

                {fetchingEpisode && (
                  <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-[var(--neo-yellow)] border-t-transparent animate-spin"></div>
                      <span className="font-normal heading-font text-white tracking-tighter italic">FETCHING NEXT EPISODE...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 text-black mt-8 gap-4">
                {prev ? (
                  <button 
                    onClick={() => navigate(`/watch/${slug}/${prev.slug}`)}
                    className="bg-white border-4 border-black p-4 font-normal heading-font uppercase text-xs md:text-sm hover:bg-[var(--neo-yellow)] shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer tracking-tighter"
                  >
                    ← PREV
                  </button>
                ) : <div />}
                
                <button 
                  onClick={() => navigate(`/detail/${slug}`)}
                  className="bg-black text-white border-4 border-black p-4 font-normal heading-font uppercase text-xs md:text-sm hover:bg-gray-800 shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer tracking-tighter"
                >
                  LIST
                </button>

                {next ? (
                  <button 
                    onClick={() => navigate(`/watch/${slug}/${next.slug}`)}
                    className="bg-white border-4 border-black p-4 font-normal heading-font uppercase text-xs md:text-sm hover:bg-[var(--neo-yellow)] shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer tracking-tighter"
                  >
                    NEXT →
                  </button>
                ) : <div />}
              </div>

              <div className="absolute -inset-4 bg-[var(--neo-yellow)] -z-10 border-4 border-black transform rotate-1 opacity-10"></div>
            </div>

            <div className="bg-white border-8 border-black p-6 md:p-12 text-black shadow-[16px_16px_0px_0px_var(--neo-purple)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative mb-12">
                <div className="bg-[var(--neo-coral)] text-white p-5 md:p-8 border-4 border-black transform -rotate-1 shadow-[8px_8px_0px_0px_black] inline-block mb-6">
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-normal heading-font uppercase leading-tight italic tracking-tighter">
                    {animeDetail?.title} - {currentEpisode?.title}
                  </h1>
                </div>
                <div className="absolute -top-4 -right-4 bg-black text-[var(--neo-yellow)] px-4 py-1 font-normal heading-font text-[10px] transform rotate-3 border-2 border-white tracking-tighter">
                  NOW_STREAMING
                </div>
              </div>
              
              <div className="space-y-10 relative z-10">
                <div className="border-t-4 border-black pt-8">
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="font-normal heading-font text-xl uppercase italic bg-[var(--neo-yellow)] px-4 py-1 border-4 border-black tracking-tighter">Stream Quality</h3>
                    <div className="flex-1 h-1 bg-black opacity-20"></div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {streams.map((stream) => (
                      <button
                        key={stream.id}
                        onClick={() => setCurrentStream(stream)}
                        className={`px-6 py-4 font-normal heading-font text-sm uppercase border-4 border-black transition-all cursor-pointer shadow-[6px_6px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 tracking-tighter ${
                          currentStream?.id === stream.id ? 'bg-[var(--neo-coral)] text-white' : 'bg-white text-black hover:bg-[var(--neo-yellow)]'
                        }`}
                      >
                        {stream.quality} <span className="text-[10px] opacity-70 mono ml-2">({stream.file_size}MB)</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
             <div className="space-y-4">
                <div className="bg-black text-[var(--neo-yellow)] p-4 border-4 border-white shadow-[4px_4px_0px_0px_black] text-center">
                    <h3 className="font-normal heading-font text-lg italic uppercase tracking-tighter">Episode List</h3>
                </div>
                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] max-h-[300px] lg:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
                    {animeDetail?.episodes?.map((ep, idx) => (
                    <button
                        key={idx}
                        ref={ep.slug === episodeSlug ? activeEpisodeRef : null}
                        onClick={() => navigate(`/watch/${slug}/${ep.slug}`)}
                        className={`w-full text-left p-4 border-b-4 border-black font-normal heading-font text-[10px] uppercase flex items-center gap-4 transition-colors tracking-tighter ${
                        ep.slug === episodeSlug ? 'bg-[var(--neo-coral)] text-white' : 'text-black hover:bg-[var(--neo-yellow)]'
                        }`}
                    >
                        <span className="w-10 h-10 shrink-0 flex items-center justify-center border-2 border-current italic bg-black/10 text-xs">{ep.episode}</span>
                        <span className="truncate">{ep.title}</span>
                    </button>
                    ))}
                </div>
             </div>

             <div className="bg-[var(--neo-yellow)] p-6 border-8 border-black shadow-[12px_12px_0px_0px_black] relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '15px 15px' }}></div>
                <div className="relative z-10">
                  <div className="bg-black text-white p-4 border-4 border-white mb-8 transform rotate-1 shadow-[8px_8px_0px_0px_white]">
                    <h3 className="font-normal heading-font text-lg italic uppercase text-center tracking-tighter">DOWNLOAD</h3>
                  </div>
                  <div className="space-y-4">
                    {streams.map((stream) => (
                      <a 
                        key={stream.id}
                        href={stream.download_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between bg-white text-black font-bold mono p-4 border-4 border-black hover:bg-black hover:text-white transition-all transform hover:-translate-x-1 shadow-[4px_4px_0px_0px_black]"
                      >
                        <span className="text-xs">{stream.quality}</span>
                        <span className="bg-[var(--neo-purple)] text-white px-2 py-1 text-[9px] border-2 border-black">GET ({stream.file_size}MB)</span>
                      </a>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-12">
            <div className="bg-black text-white p-6 border-4 border-[#FF3B30] shadow-[8px_8px_0px_0px_#FF3B30]">
               <p className="font-black oswald text-xs uppercase italic leading-tight">
                 // WARNING: Secure connection established. High-speed data transfer in progress.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;