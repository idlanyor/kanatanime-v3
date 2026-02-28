
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://v6.animekompi.fun';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
};

const cleanTitle = (title: string) => {
    return title.replace(/[\t\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
};

const getThumbnail = ($el: cheerio.Cheerio<any>) => {
    const img = $el.find('img');
    return img.attr('data-lazy-src') || img.attr('data-src') || img.attr('src') || '';
};

export const scrapeHome = async () => {
  try {
    const { data } = await axios.get(BASE_URL, { headers });
    const $ = cheerio.load(data);
    
    // 1. Latest Episodes (Rilisan Terbaru)
    const latestEpisodes: any[] = [];
    $('.listupd.normal .bs').each((i, el) => {
      const title = cleanTitle($(el).find('.tt h2').text());
      const url = $(el).find('a').attr('href') || '';
      const id = url.split('/').filter(Boolean).pop() || '';
      const thumbnail = getThumbnail($(el));
      const episode = $(el).find('.epx').text().trim();
      
      latestEpisodes.push({
        id,
        title,
        thumbnail,
        episode: episode.replace('Ep ', '').replace('Episode ', ''),
        type: 'episode',
        date_created: new Date().toISOString()
      });
    });

    // 2. Top 10 Trending Hari Ini
    const topTrending: any[] = [];
    $('#hothome').next('.listupd').find('.bs').each((i, el) => {
        const title = cleanTitle($(el).find('.tt').text());
        const url = $(el).find('a').attr('href') || '';
        const id = url.split('/').filter(Boolean).pop() || '';
        const thumbnail = getThumbnail($(el));
        const rating = $(el).find('.numscore').text().trim();
        
        topTrending.push({
            id,
            title,
            thumbnail,
            rating: parseFloat(rating) || 0,
            type: 'anime',
            status: 'ONGOING'
        });
    });

    // 3. New Series (New Series/Movie) - Scraped from the sidebar widget or bottom section
    const newSeries: any[] = [];
    // Looking for series in the big bixbox or list
    $('.bixbox').each((i, el) => {
        const header = $(el).find('.releases h3').text();
        if (header.includes('New Series')) {
            $(el).find('.bs').each((j, bs) => {
                const title = cleanTitle($(bs).find('.tt').text());
                const url = $(bs).find('a').attr('href') || '';
                const id = url.split('/').filter(Boolean).pop() || '';
                const thumbnail = getThumbnail($(bs));
                newSeries.push({ id, title, thumbnail, type: 'anime' });
            });
        }
    });

    // Fallback for newSeries if the AJAX cache prevented scraping
    if (newSeries.length === 0) {
        // Scrape from Movie page as fallback for cinematic content
        try {
            const mRes = await axios.get(`${BASE_URL}/movie/`, { headers });
            const $m = cheerio.load(mRes.data);
            $m('.listupd .bs').slice(0, 10).each((i, el) => {
                const title = cleanTitle($m(el).find('.tt').text());
                const id = ($m(el).find('a').attr('href') || '').split('/').filter(Boolean).pop() || '';
                newSeries.push({ id, title, thumbnail: getThumbnail($m(el)), type: 'movie' });
            });
        } catch (e) {}
    }

    // 4. Batch Terbaru
    const latestBatch: any[] = [];
    $('.bixbox').each((i, el) => {
        if ($(el).find('.releases h3').text().includes('BATCH')) {
            $(el).find('.bs').each((j, bs) => {
                const title = cleanTitle($(bs).find('.tt').text());
                const id = ($(bs).find('a').attr('href') || '').split('/').filter(Boolean).pop() || '';
                latestBatch.push({ id, title, thumbnail: getThumbnail($(bs)), type: 'batch' });
            });
        }
    });
    
    return {
      status: 'success',
      data: [
        { type: 'latest_episodes', data: latestEpisodes.slice(0, 12) },
        { type: 'trending', data: topTrending.slice(0, 10) },
        { type: 'new_series', data: newSeries.slice(0, 12) },
        { type: 'latest_batch', data: latestBatch.slice(0, 12) }
      ]
    };
  } catch (error) {
    console.error('scrapeHome error:', error);
    throw error;
  }
};

export const scrapeAnimeList = async (params: string = '') => {
    try {
        const { data } = await axios.get(`${BASE_URL}/anime/${params}`, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const url = $(el).find('a').attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            const episode = $(el).find('.epx').text().trim();
            const rating = $(el).find('.numscore').text().trim();
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                latest_episode: episode.replace('Ep ', '').replace('Episode ', ''),
                rating,
                type: 'anime',
                date_created: new Date().toISOString()
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeAnimeList error:', error);
        throw error;
    }
}

export const scrapeSearch = async (query: string, page: string = '1') => {
    try {
        const url = page === '1' ? `${BASE_URL}/?s=${encodeURIComponent(query)}` : `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const url = $(el).find('a').attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                type: 'anime',
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeSearch error:', error);
        throw error;
    }
}

const getAnimeSlugFromEpisode = async (episodeSlug: string) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/${episodeSlug}/`, { headers });
        const $ = cheerio.load(data);
        const animeUrl = $('.nvs.nvsc a').attr('href') || '';
        return animeUrl.split('/').filter(Boolean).pop() || '';
    } catch (e) {
        return '';
    }
};

export const scrapeDetail = async (slug: string) => {
    try {
        let currentSlug = slug;
        let response;
        
        try {
            response = await axios.get(`${BASE_URL}/anime/${currentSlug}/`, { headers });
        } catch (err: any) {
            if (err.response?.status === 404) {
                // If 404, maybe it's an episode slug
                const actualAnimeSlug = await getAnimeSlugFromEpisode(slug);
                if (actualAnimeSlug && actualAnimeSlug !== slug) {
                    currentSlug = actualAnimeSlug;
                    response = await axios.get(`${BASE_URL}/anime/${currentSlug}/`, { headers });
                } else {
                    throw err;
                }
            } else {
                throw err;
            }
        }

        const $ = cheerio.load(response.data);
        
        const title = cleanTitle($('.entry-title').text());
        const thumbnail = getThumbnail($('.thumb'));
        const synopsis = $('.entry-content p').text().trim();
        
        const info: any = {};
        $('.spe span').each((i, el) => {
            const text = $(el).text();
            if (text.includes(':')) {
                const [key, ...valParts] = text.split(':');
                const val = valParts.join(':').trim();
                info[key.toLowerCase().replace(/ /g, '_').trim()] = val;
            }
        });

        const genres: any[] = [];
        $('.genxed a').each((i, el) => {
            genres.push({
                genre: {
                    name: $(el).text().trim(),
                    slug: $(el).attr('href')?.split('/').filter(Boolean).pop()
                }
            });
        });

        const episodes: any[] = [];
        $('.eplister ul li').each((i, el) => {
            const epTitle = cleanTitle($(el).find('.epl-title').text());
            const epNum = $(el).find('.epl-num').text().trim();
            const epDate = $(el).find('.epl-date').text().trim();
            const epUrl = $(el).find('a').attr('href') || '';
            const epSlug = epUrl.split('/').filter(Boolean).pop() || '';
            
            episodes.push({
                title_indonesian: epTitle,
                number: epNum,
                date_created: epDate,
                id: epSlug
            });
        });

        const recommendations: any[] = [];
        $('.relat .bs').each((i, el) => {
            const rTitle = cleanTitle($(el).find('.tt').text());
            const rUrl = $(el).find('a').attr('href') || '';
            const rId = rUrl.split('/').filter(Boolean).pop() || '';
            const rThumb = getThumbnail($(el));
            
            recommendations.push({
                id: rId,
                title: rTitle,
                image_url: rThumb
            });
        });

        return {
            status: 'success',
            data: {
                data: {
                    id: slug,
                    title,
                    image_url: thumbnail,
                    synopsis,
                    title_japanese: info.japanese || info.judul_alternatif,
                    type: info.tipe,
                    total_episode: info.total_episode || info.jumlah_episode,
                    status: info.status,
                    duration: info.durasi,
                    release_date: info.rilis || info.aired,
                    rating: info.skor || info.rating,
                    studio: { name: info.studio },
                    genres,
                    episodes,
                    recommendations
                }
            }
        };
    } catch (error) {
        console.error('scrapeDetail error:', error);
        throw error;
    }
}

export const scrapeWatch = async (episodeSlug: string) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/${episodeSlug}/`, { headers });
        const $ = cheerio.load(data);
        
        const title = $('.entry-title').text().trim();
        const seriesUrl = $('.nvs.nvsc a').attr('href') || '';
        const seriesSlug = seriesUrl.split('/').filter(Boolean).pop() || '';
        
        // Find video players
        const streams: any[] = [];
        $('.mirror option').each((i, el) => {
            const name = $(el).text().trim();
            const value = $(el).attr('value');
            if (value) {
                try {
                    const decoded = Buffer.from(value, 'base64').toString('utf8');
                    const srcMatch = decoded.match(/src="([^"]+)"/);
                    let url = '';
                    if (srcMatch) {
                        url = srcMatch[1];
                    } else if (value.startsWith('http')) {
                         url = value;
                    }

                    if (url) {
                        streams.push({
                            id: `stream-${i}`,
                            quality: name || 'HD',
                            streaming_url: url,
                            download_url: url,
                            file_size: 0
                        });
                    }
                } catch (e) {
                    if (value.startsWith('http')) {
                        streams.push({
                            id: `stream-${i}`,
                            quality: name || 'HD',
                            streaming_url: value,
                            download_url: value,
                            file_size: 0
                        });
                    }
                }
            }
        });

        // If no streams found in mirror, check pembed
        if (streams.length === 0) {
             $('#pembed iframe, .player-embed iframe').each((i, el) => {
                let src = $(el).attr('src');
                if (src === 'about:blank') {
                    src = $(el).attr('data-lazy-src') || $(el).attr('data-src');
                }
                if (src) {
                    streams.push({
                        id: `default-${i}`,
                        quality: 'Default',
                        streaming_url: src,
                        download_url: src,
                        file_size: 0
                    });
                }
            });
        }

        // Try to find actual download links to populate more data
        $('.soraurlx').each((i, el) => {
            const quality = $(el).find('strong').text().trim();
            $(el).find('a').each((j, a) => {
                const downloadUrl = $(a).attr('href');
                const serverName = $(a).text().trim();
                if (downloadUrl) {
                    // Check if we already have a stream with this quality, maybe update its download_url
                    const existing = streams.find(s => s.quality.includes(quality));
                    if (existing && (existing.download_url.includes('blogger') || existing.download_url.includes('about:blank'))) {
                        existing.download_url = downloadUrl;
                    } else {
                         streams.push({
                            id: `download-${i}-${j}`,
                            quality: `${quality} (${serverName})`,
                            streaming_url: downloadUrl,
                            download_url: downloadUrl,
                            file_size: 0
                        });
                    }
                }
            });
        });

        return {
            status: 'success',
            data: {
                seriesSlug,
                data: streams
            }
        };
    } catch (error) {
        console.error('scrapeWatch error:', error);
        throw error;
    }
}

export const scrapeSchedule = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/jadwal-rilis/`, { headers });
        const $ = cheerio.load(data);
        const schedule: any[] = [];
        
        const dayMap: Record<string, string> = {
            'Senin': 'Monday',
            'Selasa': 'Tuesday',
            'Rabu': 'Wednesday',
            'Kamis': 'Thursday',
            'Jumat': 'Friday',
            'Jum\'at': 'Friday',
            'Sabtu': 'Saturday',
            'Minggu': 'Sunday'
        };

        $('.bixbox.schedulepage').each((i, el) => {
            const dayIndo = $(el).find('h3 span').text().trim();
            const dayEng = dayMap[dayIndo] || dayIndo;
            const animeList: any[] = [];

            $(el).find('.listupd .bs').each((j, bs) => {
                const title = cleanTitle($(bs).find('.tt').text());
                const url = $(bs).find('a').attr('href') || '';
                const id = url.split('/').filter(Boolean).pop() || '';
                const thumbnail = getThumbnail($(bs));
                
                animeList.push({
                    title,
                    slug: id,
                    poster: thumbnail
                });
            });

            if (animeList.length > 0) {
                schedule.push({
                    day: dayEng,
                    anime_list: animeList
                });
            }
        });

        return { status: 'success', data: schedule };
    } catch (error) {
        console.error('scrapeSchedule error:', error);
        throw error;
    }
}

export const scrapeSeriesList = async (type: string = '') => {
    // type can be 'anime' or 'movie' or 'donghua' or empty
    const params = `?type=${type}&order=title`;
    return scrapeAnimeList(params);
}

export const scrapeSeriesListMode = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/anime/list-mode/`, { headers });
        const $ = cheerio.load(data);
        const result: any[] = [];

        $('.soralist .blix').each((i, el) => {
            const letter = $(el).find('span a').attr('name') || $(el).find('span a').text().trim();
            const items: any[] = [];
            $(el).find('ul li a').each((j, item) => {
                const title = cleanTitle($(item).text());
                const url = $(item).attr('href') || '';
                const id = url.split('/').filter(Boolean).pop() || '';
                items.push({ id, title });
            });
            if (items.length > 0) {
                result.push({ letter, items });
            }
        });

        return { status: 'success', data: result };
    } catch (error) {
        console.error('scrapeSeriesListMode error:', error);
        throw error;
    }
}

export const scrapeMovieList = async (page: string = '1') => {
    try {
        const url = page === '1' ? `${BASE_URL}/movie/` : `${BASE_URL}/movie/page/${page}/`;
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const url = $(el).find('a').attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            const rating = $(el).find('.numscore').text().trim();
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                rating,
                type: 'movie',
                date_created: new Date().toISOString()
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeMovieList error:', error);
        throw error;
    }
}

export const scrapeDonghuaList = async (page: string = '1') => {
    try {
        const url = page === '1' ? `${BASE_URL}/genres/donghua/` : `${BASE_URL}/genres/donghua/page/${page}/`;
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const url = $(el).find('a').attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            const rating = $(el).find('.numscore').text().trim();
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                rating,
                type: 'donghua',
                date_created: new Date().toISOString()
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeDonghuaList error:', error);
        throw error;
    }
}

export const scrapeTokusatsuList = async (page: string = '1') => {
    try {
        const url = page === '1' ? `${BASE_URL}/genres/tokusatsu/` : `${BASE_URL}/genres/tokusatsu/page/${page}/`;
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const url = $(el).find('a').attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            const rating = $(el).find('.numscore').text().trim();
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                rating,
                type: 'anime',
                date_created: new Date().toISOString()
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeTokusatsuList error:', error);
        throw error;
    }
}

export const scrapeGenreList = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/genres/`, { headers });
        const $ = cheerio.load(data);
        const genres: any[] = [];
        $('.taxindex li a').each((i, el) => {
            const name = $(el).find('.name').text().trim();
            const url = $(el).attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            if (id && name) {
                genres.push({ id, name });
            }
        });
        return { status: 'success', data: genres };
    } catch (error) {
        console.error('scrapeGenreList error:', error);
        throw error;
    }
};

export const scrapeGenreDetail = async (genreId: string, page: string = '1') => {
    try {
        const url = page === '1' ? `${BASE_URL}/genres/${genreId}/` : `${BASE_URL}/genres/${genreId}/page/${page}/`;
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const itemUrl = $(el).find('a').attr('href') || '';
            const id = itemUrl.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            const episode = $(el).find('.epx').text().trim();
            const rating = $(el).find('.numscore').text().trim();
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                latest_episode: episode.replace('Ep ', '').replace('Episode ', ''),
                rating,
                type: 'anime',
                date_created: new Date().toISOString()
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeGenreDetail error:', error);
        throw error;
    }
};

export const scrapeSeasonList = async () => {
    try {
        const { data } = await axios.get(`${BASE_URL}/season/`, { headers });
        const $ = cheerio.load(data);
        const seasons: any[] = [];
        $('.taxindex li a').each((i, el) => {
            const name = $(el).find('.name').text().trim();
            const url = $(el).attr('href') || '';
            const id = url.split('/').filter(Boolean).pop() || '';
            if (id && name) {
                seasons.push({ id, name });
            }
        });
        return { status: 'success', data: seasons };
    } catch (error) {
        console.error('scrapeSeasonList error:', error);
        throw error;
    }
};

export const scrapeSeasonDetail = async (seasonId: string, page: string = '1') => {
    try {
        const url = page === '1' ? `${BASE_URL}/season/${seasonId}/` : `${BASE_URL}/season/${seasonId}/page/${page}/`;
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const list: any[] = [];
        $('.listupd .bs').each((i, el) => {
            const title = cleanTitle($(el).find('.tt').text());
            const itemUrl = $(el).find('a').attr('href') || '';
            const id = itemUrl.split('/').filter(Boolean).pop() || '';
            const thumbnail = getThumbnail($(el));
            const episode = $(el).find('.epx').text().trim();
            const rating = $(el).find('.numscore').text().trim();
            
            list.push({
                id,
                title,
                image_url: thumbnail,
                latest_episode: episode.replace('Ep ', '').replace('Episode ', ''),
                rating,
                type: 'anime',
                date_created: new Date().toISOString()
            });
        });
        const hasNextPage = $('.pagination .next').length > 0;
        return { status: 'success', data: { data: list, hasNextPage } };
    } catch (error) {
        console.error('scrapeSeasonDetail error:', error);
        throw error;
    }
};

