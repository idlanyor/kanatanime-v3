import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';
import { MOCK_ANIME } from '../constants';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import AnimeCard from '../components/AnimeCard';
import PreviewModal from '../components/PreviewModal';
import { useFavorites } from '../hooks/useFavorites';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

const Home = ({ trending, movies, completed, loading }: { trending: Anime[], movies: Anime[], completed: Anime[], loading: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState<Anime | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const trendingList = trending.length > 0 ? trending : MOCK_ANIME;
  const movieList = movies;
  const completedList = completed;
  const featuredList = trendingList.slice(0, 5); // Use top 5 for carousel

  useEffect(() => {
    if (loading || featuredList.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loading, featuredList.length]);

  if (loading) return <Loader />;

  const featured = featuredList[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredList.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-20">
      {/* Scrolling Marquee Section */}
      <div className="bg-black border-4 border-black py-4 overflow-hidden relative shadow-[8px_8px_0px_0px_var(--neo-coral)]">
        <div className="animate-marquee whitespace-nowrap flex items-center w-max">
          <span className="mx-8 text-white font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="arrow-trend-up" className="svg-inline--fa fa-arrow-trend-up w-4 h-4" role="img" viewBox="0 0 576 512" aria-hidden="true"><path fill="currentColor" d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"></path></svg>
            Welcome to KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan
          </span>
          <span className="mx-8 text-yellow-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="play" className="svg-inline--fa fa-play w-4 h-4" role="img" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"></path></svg>
            Update Setiap Hari - Anime Terbaru Tersedia
          </span>
          <span className="mx-8 text-green-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="clock" className="svg-inline--fa fa-clock w-4 h-4" role="img" viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg>
            Streaming Lancar 24/7 - Server Premium
          </span>
          <span className="mx-8 text-pink-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="star" className="svg-inline--fa fa-star w-4 h-4" role="img" viewBox="0 0 576 512" aria-hidden="true"><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"></path></svg>
            Koleksi Lengkap - Anime Ongoing & Complete
          </span>
          <span className="mx-8 text-orange-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="film" className="svg-inline--fa fa-film w-4 h-4" role="img" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM48 368l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm304-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM48 240l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm304-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM48 112l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16L64 96c-8.8 0-16 7.2-16 16zM352 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0z"></path></svg>
            Movie Anime HD - Subtitle Indonesia
          </span>
          <span className="mx-8 text-cyan-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="dragon" className="svg-inline--fa fa-dragon w-4 h-4" role="img" viewBox="0 0 640 512" aria-hidden="true"><path fill="currentColor" d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4-43.3-32.5c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0L464 0c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8 0 26.5-21.5 48-48 48l-21.5 0c-17 0-33.3-6.7-45.3-18.7l-13.3-13.3-32 0 0 21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1 0 60.6-49.1 109.8-109.8 109.8L32.3 512c-3.3 0-6.6-.4-9.6-1.4-9.2-2.8-16.7-9.6-20.4-18.6-1.3-3.3-2.2-6.9-2.3-10.7-.2-3.7 .3-7.3 1.3-10.7 2.8-9.2 9.6-16.7 18.6-20.4 3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1 0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1l0-102.5zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3l0 .6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9 0 13.3 10.7 24 24 24 10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87 0 27.5c0 32.8 8.4 64.8 24 93l-232 0c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9S.1 232.8 5.4 228L130.9 116.5z"></path></svg>
            Donghua Update - Animasi China Terpopuler
          </span>
          <span className="mx-8 text-white font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="fire" className="svg-inline--fa fa-fire w-4 h-4" role="img" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M160.5-26.4c9.3-7.8 23-7.5 31.9 .9 12.3 11.6 23.3 24.4 33.9 37.4 13.5 16.5 29.7 38.3 45.3 64.2 5.2-6.8 10-12.8 14.2-17.9 1.1-1.3 2.2-2.7 3.3-4.1 7.9-9.8 17.7-22.1 30.8-22.1 13.4 0 22.8 11.9 30.8 22.1 1.3 1.7 2.6 3.3 3.9 4.8 10.3 12.4 24 30.3 37.7 52.4 27.2 43.9 55.6 106.4 55.6 176.6 0 123.7-100.3 224-224 224S0 411.7 0 288c0-91.1 41.1-170 80.5-225 19.9-27.7 39.7-49.9 54.6-65.1 8.2-8.4 16.5-16.7 25.5-24.2zM225.7 416c25.3 0 47.7-7 68.8-21 42.1-29.4 53.4-88.2 28.1-134.4-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5-17.3-22.1-49.1-62.4-65.3-83-5.4-6.9-15.2-8-21.5-1.9-18.3 17.8-51.5 56.8-51.5 104.3 0 68.6 50.6 109.2 113.7 109.2z"></path></svg>
            Gratis Tanpa Iklan - 100% Free Streaming
          </span>

          {/* Repeat for seamless loop */}
          <span className="mx-8 text-white font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="arrow-trend-up" className="svg-inline--fa fa-arrow-trend-up w-4 h-4" role="img" viewBox="0 0 576 512" aria-hidden="true"><path fill="currentColor" d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"></path></svg>
            Welcome to KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan
          </span>
          <span className="mx-8 text-yellow-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="play" className="svg-inline--fa fa-play w-4 h-4" role="img" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"></path></svg>
            Update Setiap Hari - Anime Terbaru Tersedia
          </span>
          <span className="mx-8 text-green-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="clock" className="svg-inline--fa fa-clock w-4 h-4" role="img" viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg>
            Streaming Lancar 24/7 - Server Premium
          </span>
          <span className="mx-8 text-pink-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="star" className="svg-inline--fa fa-star w-4 h-4" role="img" viewBox="0 0 576 512" aria-hidden="true"><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"></path></svg>
            Koleksi Lengkap - Anime Ongoing & Complete
          </span>
          <span className="mx-8 text-orange-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="film" className="svg-inline--fa fa-film w-4 h-4" role="img" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM48 368l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm304-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM48 240l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm304-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM48 112l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16L64 96c-8.8 0-16 7.2-16 16zM352 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0z"></path></svg>
            Movie Anime HD - Subtitle Indonesia
          </span>
          <span className="mx-8 text-cyan-300 font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="dragon" className="svg-inline--fa fa-dragon w-4 h-4" role="img" viewBox="0 0 640 512" aria-hidden="true"><path fill="currentColor" d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4-43.3-32.5c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0L464 0c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8 0 26.5-21.5 48-48 48l-21.5 0c-17 0-33.3-6.7-45.3-18.7l-13.3-13.3-32 0 0 21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1 0 60.6-49.1 109.8-109.8 109.8L32.3 512c-3.3 0-6.6-.4-9.6-1.4-9.2-2.8-16.7-9.6-20.4-18.6-1.3-3.3-2.2-6.9-2.3-10.7-.2-3.7 .3-7.3 1.3-10.7 2.8-9.2 9.6-16.7 18.6-20.4 3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1 0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1l0-102.5zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3l0 .6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9 0 13.3 10.7 24 24 24 10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87 0 27.5c0 32.8 8.4 64.8 24 93l-232 0c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9S.1 232.8 5.4 228L130.9 116.5z"></path></svg>
            Donghua Update - Animasi China Terpopuler
          </span>
          <span className="mx-8 text-white font-semibold flex items-center gap-2">
            <svg data-prefix="fas" data-icon="fire" className="svg-inline--fa fa-fire w-4 h-4" role="img" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M160.5-26.4c9.3-7.8 23-7.5 31.9 .9 12.3 11.6 23.3 24.4 33.9 37.4 13.5 16.5 29.7 38.3 45.3 64.2 5.2-6.8 10-12.8 14.2-17.9 1.1-1.3 2.2-2.7 3.3-4.1 7.9-9.8 17.7-22.1 30.8-22.1 13.4 0 22.8 11.9 30.8 22.1 1.3 1.7 2.6 3.3 3.9 4.8 10.3 12.4 24 30.3 37.7 52.4 27.2 43.9 55.6 106.4 55.6 176.6 0 123.7-100.3 224-224 224S0 411.7 0 288c0-91.1 41.1-170 80.5-225 19.9-27.7 39.7-49.9 54.6-65.1 8.2-8.4 16.5-16.7 25.5-24.2zM225.7 416c25.3 0 47.7-7 68.8-21 42.1-29.4 53.4-88.2 28.1-134.4-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5-17.3-22.1-49.1-62.4-65.3-83-5.4-6.9-15.2-8-21.5-1.9-18.3 17.8-51.5 56.8-51.5 104.3 0 68.6 50.6 109.2 113.7 109.2z"></path></svg>
            Gratis Tanpa Iklan - 100% Free Streaming
          </span>
        </div>
      </div>

      {/* Hero Carousel Section - Redesigned to Industrial Dossier Style */}
      <section className="relative min-h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden bg-[#0c0c0c] border-8 border-black shadow-[20px_20px_0px_0px_black] group">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--neo-yellow) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_45%,var(--neo-purple)_45%,var(--neo-purple)_55%,transparent_55%)] bg-[length:100px_100px] opacity-5"></div>

        {/* Big Background Text */}
        <div className="absolute -top-6 md:-top-10 -left-6 md:-left-10 font-black text-[5rem] md:text-[15rem] text-white opacity-[0.03] select-none pointer-events-none italic tracking-tighter">
           TRENDING
        </div>

        {/* Main Visual Card - Tilted & Wrapped in Link */}
        <div className="relative w-[85%] md:w-[80%] h-[300px] md:h-[400px] lg:h-[500px] z-10 transition-transform duration-700 group-hover:scale-[1.02]">
           <Link to={featured.type === 'episode' ? `/episode/${featured.id}` : `/detail/${featured.id}`} className="absolute inset-0 z-10 block">
              <div className="absolute inset-0 bg-black transform rotate-1 shadow-[8px_8px_0px_0px_var(--neo-coral)] md:shadow-[15px_15px_0px_0px_var(--neo-coral)]"></div>
              <div className="absolute inset-0 border-4 md:border-8 border-black overflow-hidden transform -rotate-1 bg-gray-900 shadow-[6px_6px_0px_0px_white] md:shadow-[10px_10px_0px_0px_white]">
                 <img 
                   key={featured.id + '-img'}
                   src={featured.banner} 
                   className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 animate-in fade-in zoom-in duration-500" 
                   alt="Hero" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
              </div>
           </Link>

           {/* Floating Info Dossier */}
           <div className="absolute -bottom-10 left-4 right-4 md:bottom-10 md:-left-10 md:right-auto z-20 max-w-sm md:max-w-xl pointer-events-none">
              <div className="bg-[var(--neo-yellow)] border-4 border-black p-4 md:p-10 shadow-[8px_8px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] transform md:rotate-1 animate-in slide-in-from-left-8 duration-500 pointer-events-auto">
                 <div className="flex gap-2 mb-2 md:mb-4">
                    <Badge color="black" className="text-[8px] md:text-[10px] italic">TOP_INTEL</Badge>
                    <Badge color="coral" className="text-[8px] md:text-[10px]">EP_{featured.episode}</Badge>
                 </div>
                 <h1 className="text-xl md:text-3xl lg:text-4xl font-normal heading-font text-black leading-none mb-3 md:mb-6 italic uppercase tracking-tighter drop-shadow-[1px_1px_0px_white] md:drop-shadow-[2px_2px_0px_white] line-clamp-1 md:line-clamp-none">
                    {featured.title}
                 </h1>
                 <div className="hidden md:block bg-black text-white p-4 border-l-8 border-[var(--neo-coral)] mb-6 shadow-[4px_4px_0px_0px_white]">
                    <p className="text-xs md:text-sm font-bold italic line-clamp-2 mono leading-tight">
                       {featured.synopsis}
                    </p>
                 </div>
                 <div className="flex gap-2 md:gap-4">
                    <button 
                       onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(featured);
                       }}
                       className={`p-3 md:p-5 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_black] md:shadow-[6px_6px_0px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
                          isFavorite(featured.id) ? 'bg-[var(--neo-coral)] text-white' : 'bg-white text-black'
                       }`}
                    >
                       <FontAwesomeIcon icon={isFavorite(featured.id) ? faHeartSolid : faHeartRegular} className="text-xs md:text-base" />
                    </button>
                    <div className="flex-1 bg-black text-white px-4 flex items-center justify-center font-normal heading-font text-[10px] md:text-xs italic uppercase tracking-widest border-2 md:border-4 border-black">
                       CLICK_ANYWHERE_TO_DECODE
                    </div>
                 </div>
              </div>
           </div>

           {/* Floating Metadata Tags */}
           <div className="absolute -top-6 -right-4 md:top-10 md:-right-10 z-20 flex flex-col gap-3">
              <div className="bg-[var(--neo-purple)] border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_black] transform -rotate-3">
                 <span className="font-normal heading-font text-white text-sm italic">★ {featured.rating}</span>
              </div>
              <div className="bg-white border-4 border-black px-6 py-2 shadow-[8px_8px_0px_0px_black] transform rotate-2">
                 <span className="font-normal heading-font text-black text-[10px] italic uppercase tracking-widest">{featured.year}</span>
              </div>
           </div>
        </div>

        {/* Industrial Carousel Controls - Centered Sides */}
        <div className="absolute inset-y-0 left-0 md:left-4 z-[50] flex items-center px-2">
           <button 
             onClick={prevSlide}
             className="w-10 h-10 md:w-16 md:h-16 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center hover:bg-[var(--neo-yellow)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer group/nav"
           >
             <span className="font-black text-2xl md:text-4xl leading-none">←</span>
           </button>
        </div>
        <div className="absolute inset-y-0 right-0 md:right-4 z-[50] flex items-center px-2">
           <button 
             onClick={nextSlide}
             className="w-10 h-10 md:w-16 md:h-16 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center hover:bg-[var(--neo-yellow)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all cursor-pointer group/nav"
           >
             <span className="font-black text-2xl md:text-4xl leading-none">→</span>
           </button>
        </div>

        {/* Frame ID Indicator */}
        <div className="absolute top-4 right-4 z-30 bg-black text-white px-3 py-1 border-2 border-white mono text-[10px] font-bold">
           FRAME_ID: {currentIndex + 1}/05
        </div>

        {/* Status Indicators Side */}
        <div className="absolute left-8 bottom-8 z-30 hidden md:flex flex-col gap-3">
           {featuredList.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1 transition-all duration-500 border border-black ${idx === currentIndex ? 'w-16 bg-[var(--neo-coral)]' : 'w-8 bg-white/30'}`}
             ></div>
           ))}
        </div>
      </section>

      {/* Trending Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF3B30] text-white px-6 py-3 border-4 border-black transform -rotate-1 shadow-[8px_8px_0px_0px_black]">
              <h2 className="text-4xl md:text-5xl font-black syne italic uppercase">Sedang Populer</h2>
            </div>
            <div className="hidden md:block flex-1 h-2 bg-black min-w-[50px]"></div>
          </div>
          <Link to="/trending">
            <button className="px-6 py-2 bg-[#FFCC00] text-black font-black syne border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer uppercase text-sm md:text-lg">
              See All →
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          {trendingList.map((anime, index) => (
            <div 
              key={`trending-${anime.id}-${index}`} 
              className="animate-reveal" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AnimeCard anime={anime} onHold={(a) => setSelectedPreview(a)} />
            </div>
          ))}
        </div>
      </section>

      {/* Movies Section */}
      {movieList.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFCC00] text-black px-6 py-3 border-4 border-black transform rotate-1 shadow-[8px_8px_0px_0px_black]">
                <h2 className="text-4xl md:text-5xl font-black syne italic uppercase">Film Layar Lebar</h2>
              </div>
              <div className="hidden md:block flex-1 h-2 bg-black min-w-[50px]"></div>
            </div>
            <Link to="/movies">
              <button className="px-6 py-2 bg-black text-white font-black syne border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer uppercase text-sm md:text-lg">
                See All →
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
            {movieList.map((anime, index) => (
              <div 
                key={`movie-${anime.id}-${index}`} 
                className="animate-reveal" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AnimeCard anime={anime} onHold={(a) => setSelectedPreview(a)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Donghua Section */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#007AFF] text-white px-6 py-3 border-4 border-black transform rotate-1 shadow-[8px_8px_0px_0px_black]">
              <h2 className="text-4xl md:text-5xl font-black syne italic uppercase">Animasi China</h2>
            </div>
            <div className="hidden md:block flex-1 h-2 bg-black min-w-[50px]"></div>
          </div>
          <Link to="/donghua">
            <button className="px-6 py-2 bg-[#4CD964] text-black font-black syne border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer uppercase text-sm md:text-lg">
              See All →
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
          {completedList.map((anime, index) => (
            <div 
              key={`donghua-${anime.id}-${index}`} 
              className="animate-reveal" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AnimeCard anime={anime} onHold={(a) => setSelectedPreview(a)} />
            </div>
          ))}
        </div>
      </section>

      {/* Global Preview Modal */}
      <PreviewModal 
        anime={selectedPreview} 
        onClose={() => setSelectedPreview(null)} 
      />
    </div>
  );
};

export default Home;