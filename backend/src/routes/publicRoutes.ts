import { Router, Request, Response } from 'express';
import { repository } from '../repositories/dataRepository.js';

export const publicRouter = Router();

// GET /api/locations - Active locations with site counts
publicRouter.get('/locations', async (_req: Request, res: Response) => {
  try {
    const locations = await repository.getLocations(true);
    res.json(locations);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch locations', details: err.message });
  }
});

// GET /api/locations/:slug/sites - Sites belonging to a specific location
publicRouter.get('/locations/:slug/sites', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const location = await repository.getLocationBySlug(slug);
    if (!location) {
      res.status(404).json({ error: `Location '${slug}' not found` });
      return;
    }

    const sites = await repository.getSites({
      locationId: location.id,
      publishedOnly: true,
    });

    res.json({
      location,
      sites,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch sites for location', details: err.message });
  }
});

// GET /api/categories - Unique property categories with counts
publicRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const sites = await repository.getSites({ publishedOnly: true });
    const categoryCounts: Record<string, number> = {};
    const defaultCategories = ['Residential', 'Retail', 'Office', 'Serviced Apartments'];
    
    defaultCategories.forEach(cat => {
      categoryCounts[cat] = 0;
    });

    sites.forEach(site => {
      const type = site.siteType || 'Residential';
      categoryCounts[type] = (categoryCounts[type] || 0) + 1;
    });

    const result = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
});

// GET /api/sites - All published sites
publicRouter.get('/sites', async (req: Request, res: Response) => {
  try {
    const locationSlug = req.query.location as string | undefined;
    const siteType = (req.query.siteType || req.query.category) as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

    const sites = await repository.getSites({
      locationSlug,
      siteType,
      status,
      search,
      limit,
      offset,
      publishedOnly: true,
    });
    res.json(sites);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch sites', details: err.message });
  }
});

// GET /api/sites/:slug - Detailed site information
publicRouter.get('/sites/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const site = await repository.getSiteBySlug(slug, true);
    if (!site) {
      res.status(404).json({ error: `Site '${slug}' not found or is unpublished` });
      return;
    }

    res.json(site);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch site details', details: err.message });
  }
});

// GET /api/settings - Public contact & company info
publicRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await repository.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
});

// GET /api/stats - Public summary counts for hero statistics
publicRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await repository.getPublicStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch public stats', details: err.message });
  }
});

// --- BLOG POSTS (PUBLIC) ---
// GET /api/blogs - Published blog posts
publicRouter.get('/blogs', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

    const blogs = await repository.getBlogs({
      publishedOnly: true,
      category,
      search,
      limit,
      offset,
    });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blogs', details: err.message });
  }
});

// GET /api/blogs/categories - Unique categories of published blogs
publicRouter.get('/blogs/categories', async (_req: Request, res: Response) => {
  try {
    const blogs = await repository.getBlogs({ publishedOnly: true });
    const categories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog categories', details: err.message });
  }
});

// GET /api/blogs/:slug - Single published blog post
publicRouter.get('/blogs/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await repository.getBlogBySlug(slug, true);
    if (!blog) {
      res.status(404).json({ error: `Blog post '${slug}' not found or is unpublished` });
      return;
    }
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog details', details: err.message });
  }
});
