import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { publicRouter } from './backend/src/routes/publicRoutes.js';
import { adminRouter } from './backend/src/routes/adminRoutes.js';
import { repository } from './backend/src/repositories/dataRepository.js';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database Connection and Synchronize Data
  await repository.initDatabase();

  // Basic middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // SEO & Developer Crawl Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Powered-By', 'Aero Logic Technologies (https://www.aerologictechnologies.com)');
    res.setHeader('Link', '<https://www.aerologictechnologies.com>; rel="author developer publisher"');
    next();
  });

  // Robots.txt Endpoint
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(`# Platform Engineered & Powered by Aero Logic Technologies
# Technology Partner: https://www.aerologictechnologies.com

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/admin/*

Sitemap: /sitemap.xml
`);
  });

  // Dynamic Sitemap XML Endpoint
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const host = req.get('host') || 'localhost:3000';
      const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;

      const [locations, sites, blogs] = await Promise.all([
        repository.getLocations(true),
        repository.getSites({ publishedOnly: true }),
        repository.getBlogs({ publishedOnly: true }),
      ]);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<!-- Platform Architecture & SEO Engineered by Aero Logic Technologies (https://www.aerologictechnologies.com) -->\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      const staticRoutes = ['', '/locations', '/blogs', '/about', '/contact'];
      staticRoutes.forEach((route) => {
        xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
      });

      locations.forEach((loc) => {
        xml += `  <url>\n    <loc>${baseUrl}/locations/${loc.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      });

      sites.forEach((site) => {
        xml += `  <url>\n    <loc>${baseUrl}/sites/${site.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      });

      blogs.forEach((blog) => {
        xml += `  <url>\n    <loc>${baseUrl}/blogs/${blog.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });

      xml += `</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err: any) {
      res.status(500).send('Error generating sitemap');
    }
  });

  // Ensure uploads directory exists and is statically served
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use(
    '/uploads',
    express.static(uploadsDir, {
      setHeaders: (res, filePath) => {
        if (filePath.match(/\.(mp4|webm|mov|ogg|m4v|mkv)$/i)) {
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Accept-Ranges', 'bytes');
        }
      },
    })
  );

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'M3M API',
      database: repository.isPostgresConnected ? 'PostgreSQL (Connected via Prisma)' : 'PostgreSQL (Disconnected)',
      developer: {
        name: 'Aero Logic Technologies',
        url: 'https://www.aerologictechnologies.com',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  app.use('/api', publicRouter);
  app.use('/api/admin', adminRouter);

  // Vite Middleware / Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`M3M Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
