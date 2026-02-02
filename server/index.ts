import { serve } from '@hono/node-server'
import { getConnInfo } from '@hono/node-server/conninfo'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { 
  scrapeHome, 
  scrapeAnimeList, 
  scrapeDetail, 
  scrapeWatch, 
  scrapeSearch,
  scrapeSchedule,
  scrapeSeriesList,
  scrapeSeriesListMode,
  scrapeMovieList,
  scrapeDonghuaList 
} from './scraper'

const app = new Hono()

app.use('*', cors())
app.use('*', async (c, next) => {
  const info = getConnInfo(c)
  const forwarded = c.req.header('x-forwarded-for')
  const realIp = c.req.header('x-real-ip')
  const socketIp = info.remote.address
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || socketIp || 'unknown'
  console.log(`[request] ip=${ip} method=${c.req.method} path=${c.req.path}`)
  await next()
})
app.use('*', logger())

const SANKA_BASE_URL = 'https://www.sankavollerei.com/anime'
const RYZUMI_BASE_URL = 'https://backend.ryzumi.vip/anime'

// Helper to fetch and stream response
const proxyRequest = async (c: any, targetUrl: string) => {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
    }

    // Forward relevant headers from client
    const headersToForward = ['authorization', 'content-type', 'x-token-ajaib', 'x-fid']
    headersToForward.forEach(h => {
      const val = c.req.header(h)
      if (val) headers[h] = val
    })

    const fetchOptions: any = {
      method: c.req.method,
      headers: headers,
    }

    // Forward body for non-GET requests
    if (c.req.method !== 'GET') {
      const body = await c.req.text()
      if (body) {
        fetchOptions.body = body
      }
    }

    const response = await fetch(targetUrl, fetchOptions)

    // Forward status
    c.status(response.status)

    // Forward content type
    const contentType = response.headers.get('content-type')
    if (contentType) {
      c.header('Content-Type', contentType)
    }

    // Return body
    const responseBody = await response.text()
    try {
        return c.json(JSON.parse(responseBody))
    } catch (e) {
        return c.body(responseBody)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    return c.json({ error: 'Proxy failed', details: String(error) }, 500)
  }
}

app.get('/', (c) => {
  return c.text('Anime Proxy Server is running!')
})

// Scraper Routes
app.get('/api/animeplay/home', async (c) => {
    try {
        const data = await scrapeHome()
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/trending', async (c) => {
    try {
        const result = await scrapeAnimeList('?order=popular')
        return c.json({ status: 'success', data: result.data.data })
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/ongoing', async (c) => {
    const page = c.req.query('page') || '1'
    try {
        const result = await scrapeAnimeList(`?status=ongoing&page=${page}`)
        return c.json(result)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/complete', async (c) => {
    const page = c.req.query('page') || '1'
    try {
        const result = await scrapeAnimeList(`?status=completed&page=${page}`)
        return c.json(result)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/donghua', async (c) => {
    const page = c.req.query('page') || '1'
    try {
        const result = await scrapeDonghuaList(page)
        return c.json(result)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/listanime', async (c) => {
    try {
        const data = await scrapeSeriesListMode()
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/list-mode', async (c) => {
    try {
        const data = await scrapeSeriesListMode()
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/listdonghua', async (c) => {
    try {
        const data = await scrapeSeriesList('donghua')
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/movies', async (c) => {
    const page = c.req.query('page') || '1'
    try {
        const result = await scrapeMovieList(page)
        return c.json(result)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/schedule', async (c) => {
    try {
        const data = await scrapeSchedule()
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/search', async (c) => {
    const query = c.req.query('q') || ''
    try {
        const data = await scrapeSearch(query)
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/detail/:slug', async (c) => {
    const slug = c.req.param('slug')
    try {
        const data = await scrapeDetail(slug)
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

app.get('/api/animeplay/watch/:slug', async (c) => {
    const slug = c.req.param('slug')
    try {
        const data = await scrapeWatch(slug)
        return c.json(data)
    } catch (e) {
        return c.json({ error: String(e) }, 500)
    }
})

// Legacy / Other Routes
app.all('/api/sanka/*', async (c) => {
  const path = c.req.path.replace('/api/ryzumi', '')
  const query = c.req.query()
  const queryString = new URLSearchParams(query).toString()
  const targetUrl = `${RYZUMI_BASE_URL}${path}${queryString ? '?' + queryString : ''}`

  return proxyRequest(c, targetUrl)
})

const port = 3051
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
