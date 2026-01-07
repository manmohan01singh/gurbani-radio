/**
 * GURBANI RADIO SERVER - Fixed R2 Proxy
 * All filenames are LOWERCASE to match R2
 */

const express = require('express');
const path = require('path');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

const CONFIG = {
    R2_BASE_URL: 'https://pub-525228169e0c44e38a67c306ba1a458c.r2.dev',
    FRONTEND_DIR: path.join(__dirname, '..', 'frontend'),
};

// All filenames LOWERCASE to match R2
const PLAYLIST = [
    { id: 1, filename: 'day-1.webm', title: 'Day 1 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 2, filename: 'day-2.webm', title: 'Day 2 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 3, filename: 'day-3.webm', title: 'Day 3 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 4, filename: 'day-4.webm', title: 'Day 4 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 5, filename: 'day-5.webm', title: 'Day 5 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 6, filename: 'day-6.webm', title: 'Day 6 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 7, filename: 'day-7.webm', title: 'Day 7 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 8, filename: 'day-8.webm', title: 'Day 8 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 9, filename: 'day-9.webm', title: 'Day 9 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 10, filename: 'day-10.webm', title: 'Day 10 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 11, filename: 'day-11.webm', title: 'Day 11 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 12, filename: 'day-12.webm', title: 'Day 12 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 13, filename: 'day-13.webm', title: 'Day 13 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 14, filename: 'day-14.webm', title: 'Day 14 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 15, filename: 'day-15.webm', title: 'Day 15 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 16, filename: 'day-16.webm', title: 'Day 16 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 17, filename: 'day-17.webm', title: 'Day 17 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 18, filename: 'day-18.webm', title: 'Day 18 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 19, filename: 'day-19.webm', title: 'Day 19 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 20, filename: 'day-20.webm', title: 'Day 20 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 21, filename: 'day-21.webm', title: 'Day 21 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 22, filename: 'day-22.webm', title: 'Day 22 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 23, filename: 'day-23.webm', title: 'Day 23 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 24, filename: 'day-24.webm', title: 'Day 24 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 25, filename: 'day-25.webm', title: 'Day 25 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 26, filename: 'day-26.webm', title: 'Day 26 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 27, filename: 'day-27.webm', title: 'Day 27 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 28, filename: 'day-28.webm', title: 'Day 28 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 29, filename: 'day-29.webm', title: 'Day 29 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 30, filename: 'day-30.webm', title: 'Day 30 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 31, filename: 'day-31.webm', title: 'Day 31 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 32, filename: 'day-32.webm', title: 'Day 32 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 33, filename: 'day-33.webm', title: 'Day 33 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 34, filename: 'day-34.webm', title: 'Day 34 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 35, filename: 'day-35.webm', title: 'Day 35 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 36, filename: 'day-36.webm', title: 'Day 36 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 37, filename: 'day-37.webm', title: 'Day 37 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 38, filename: 'day-38.webm', title: 'Day 38 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 39, filename: 'day-39.webm', title: 'Day 39 - Gurbani Kirtan', artist: 'Divine Shabad' },
    { id: 40, filename: 'day-40.webm', title: 'Day 40 - Gurbani Kirtan', artist: 'Divine Shabad' }
];

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// Static files
app.use(express.static(CONFIG.FRONTEND_DIR));

// ═══════════════════════════════════════════════════════════════════
// AUDIO PROXY
// ═══════════════════════════════════════════════════════════════════

app.get('/audio/:filename', async (req, res) => {
    const filename = req.params.filename;
    const r2Url = `${CONFIG.R2_BASE_URL}/${filename}`;
    
    console.log(`[Proxy] Fetching: ${r2Url}`);
    
    try {
        const fetchOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; GurbaniRadio/1.0)',
                'Accept': '*/*',
            }
        };
        
        if (req.headers.range) {
            fetchOptions.headers['Range'] = req.headers.range;
        }
        
        const r2Response = await fetch(r2Url, fetchOptions);
        
        console.log(`[Proxy] R2 Response: ${r2Response.status}`);
        
        if (!r2Response.ok && r2Response.status !== 206) {
            console.error(`[Proxy] R2 Error: ${r2Response.status}`);
            return res.status(r2Response.status).json({
                error: 'Audio not found',
                status: r2Response.status,
                url: r2Url
            });
        }
        
        const contentType = r2Response.headers.get('content-type') || 'audio/webm';
        const contentLength = r2Response.headers.get('content-length');
        const contentRange = r2Response.headers.get('content-range');
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }
        
        if (contentRange) {
            res.setHeader('Content-Range', contentRange);
            res.status(206);
        }
        
        console.log(`[Proxy] ✓ Streaming ${filename}`);
        
        const stream = Readable.fromWeb(r2Response.body);
        stream.pipe(res);
        
        stream.on('error', (err) => {
            console.error('[Proxy] Stream error:', err.message);
        });
        
        res.on('close', () => {
            stream.destroy();
        });
        
    } catch (error) {
        console.error('[Proxy] Error:', error.message);
        res.status(500).json({ error: 'Proxy error', message: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════════
// TEST ROUTE - Using LOWERCASE filename
// ═══════════════════════════════════════════════════════════════════

app.get('/test-r2', async (req, res) => {
    // LOWERCASE filename!
    const testUrl = `${CONFIG.R2_BASE_URL}/day-31.webm`;
    
    console.log('[Test] Testing:', testUrl);
    
    try {
        const response = await fetch(testUrl, { method: 'HEAD' });
        
        const headers = {};
        response.headers.forEach((v, k) => headers[k] = v);
        
        res.json({
            success: response.ok,
            status: response.status,
            url: testUrl,
            headers: headers
        });
        
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
});

// API Routes
app.get('/api/tracks', (req, res) => {
    res.json({ tracks: PLAYLIST, baseUrl: '/audio' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(CONFIG.FRONTEND_DIR, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🙏 GURBANI RADIO SERVER');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  🌐 Player:     http://localhost:${PORT}/`);
    console.log(`  🎵 Audio:      http://localhost:${PORT}/audio/day-31.webm`);
    console.log(`  🔧 Test R2:    http://localhost:${PORT}/test-r2`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
});