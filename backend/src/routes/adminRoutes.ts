import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { repository } from '../repositories/dataRepository.js';
import { authenticateAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { upload, storageProvider } from '../utils/storage.js';
import { AuthTokenPayload } from '../types.js';

export const adminRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'm3m_luxury_jwt_secure_key_2025';

// POST /api/admin/auth/login
adminRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await repository.findAdminByEmail(email.trim());
    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid credentials or inactive account' });
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// All subsequent routes require admin authentication
adminRouter.use(authenticateAdmin as any);

// GET /api/admin/auth/me
adminRouter.get('/auth/me', async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await repository.findAdminById(req.user.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

// POST /api/admin/auth/change-password
adminRouter.post('/auth/change-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      res.status(400).json({ error: 'New password and confirmation password do not match' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long' });
      return;
    }

    const user = await repository.findAdminById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: 'Admin user not found' });
      return;
    }

    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Incorrect current password' });
      return;
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    const ok = await repository.updateAdminPassword(user.id, newHash);
    if (!ok) {
      res.status(500).json({ error: 'Failed to update password' });
      return;
    }

    res.json({ message: 'Password changed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to change password', details: err.message });
  }
});

// GET /api/admin/dashboard
adminRouter.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const stats = await repository.getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve dashboard stats', details: err.message });
  }
});

// --- SITES CRUD ---
// GET /api/admin/sites
adminRouter.get('/sites', async (req: Request, res: Response) => {
  try {
    const siteType = (req.query.siteType || req.query.category) as string | undefined;
    const locationSlug = req.query.location as string | undefined;
    const search = req.query.search as string | undefined;
    const sites = await repository.getSites({ siteType, locationSlug, search });
    res.json(sites);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch sites', details: err.message });
  }
});

// GET /api/admin/sites/:id
adminRouter.get('/sites/:id', async (req: Request, res: Response) => {
  try {
    const site = await repository.getSiteById(req.params.id);
    if (!site) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }
    res.json(site);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch site', details: err.message });
  }
});

// POST /api/admin/sites
adminRouter.post('/sites', async (req: Request, res: Response) => {
  try {
    const {
      locationId,
      name,
      address,
      description,
      googleMapsUrl,
      latitude,
      longitude,
      siteType,
      startingPrice,
      features,
      locationAdvantages,
      videoUrl,
      status,
      isPublished,
      images,
      plotSizes,
    } = req.body;

    if (!locationId || !name || !address || !description) {
      res.status(400).json({ error: 'Location, site name, address, and description are required.' });
      return;
    }

    const created = await repository.createSite({
      locationId,
      name,
      address,
      description,
      googleMapsUrl,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      siteType,
      startingPrice,
      features,
      locationAdvantages,
      videoUrl,
      status,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      images,
      plotSizes,
    });

    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create site', details: err.message });
  }
});

// PUT /api/admin/sites/:id
adminRouter.put('/sites/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repository.updateSite(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update site', details: err.message });
  }
});

// DELETE /api/admin/sites/:id
adminRouter.delete('/sites/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = await repository.deleteSite(id);
    if (!ok) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }
    res.json({ message: 'Site deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete site', details: err.message });
  }
});

// --- IMAGE & VIDEO UPLOAD & MANAGEMENT ---
// POST /api/admin/upload - Direct single image or video file upload
adminRouter.post('/upload', (req: Request, res: Response) => {
  upload.any()(req, res, async (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'File size exceeds 100MB limit. Please upload a smaller media file.' });
          return;
        }
        res.status(400).json({ error: err.message || 'File upload failed' });
        return;
      }
      res.status(400).json({ error: err.message || 'Only standard images (JPEG, PNG, WebP) and video files (MP4, WebM, MOV, MKV) are permitted' });
      return;
    }

    try {
      const files = req.files as Express.Multer.File[];
      const file = files && files.length > 0 ? files[0] : (req.file as Express.Multer.File | undefined);
      if (!file) {
        res.status(400).json({ error: 'No file provided' });
        return;
      }
      const publicUrl = await storageProvider.saveFile(file);
      res.status(201).json({ imageUrl: publicUrl, videoUrl: publicUrl, url: publicUrl });
    } catch (uploadErr: any) {
      res.status(500).json({ error: uploadErr.message || 'Failed to upload media file' });
    }
  });
});

// POST /api/admin/sites/:id/images - Upload image or supply image URL
adminRouter.post('/sites/:id/images', (req: Request, res: Response) => {
  upload.array('photos', 10)(req, res, async (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'File size exceeds maximum permitted limit (100MB)' });
          return;
        }
        res.status(400).json({ error: err.message || 'Image upload failed' });
        return;
      }
      res.status(400).json({ error: err.message || 'Only standard images (JPEG, PNG, WebP) and video files (MP4, WebM, MOV, MKV) are permitted' });
      return;
    }

    try {
      const { id } = req.params;
      const site = await repository.getSiteById(id);
      if (!site) {
        res.status(404).json({ error: 'Site not found' });
        return;
      }

      const addedImages = [];
      const files = req.files as Express.Multer.File[];

      if (files && files.length > 0) {
        for (const file of files) {
          const publicUrl = await storageProvider.saveFile(file);
          const img = await repository.addSiteImage(id, publicUrl);
          if (img) addedImages.push(img);
        }
      } else if (req.body.imageUrl) {
        const img = await repository.addSiteImage(id, req.body.imageUrl.trim(), req.body.isCover === true);
        if (img) addedImages.push(img);
      } else {
        res.status(400).json({ error: 'No files or imageUrl provided' });
        return;
      }

      const updatedSite = await repository.getSiteById(id);
      res.status(201).json({
        message: 'Images added successfully',
        images: addedImages,
        site: updatedSite,
      });
    } catch (uploadErr: any) {
      res.status(500).json({ error: uploadErr.message || 'Failed to upload images' });
    }
  });
});

// PUT /api/admin/sites/:id/images/:imageId/cover
adminRouter.put('/sites/:id/images/:imageId/cover', async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params;
    const ok = await repository.setCoverImage(id, imageId);
    if (!ok) {
      res.status(404).json({ error: 'Site or image not found' });
      return;
    }
    const site = await repository.getSiteById(id);
    res.json({ message: 'Cover image updated', site });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update cover image', details: err.message });
  }
});

// PUT /api/admin/sites/:id/images/reorder
adminRouter.put('/sites/:id/images/reorder', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imageIds } = req.body;
    if (!Array.isArray(imageIds)) {
      res.status(400).json({ error: 'imageIds must be an array of IDs' });
      return;
    }
    await repository.reorderImages(id, imageIds);
    const site = await repository.getSiteById(id);
    res.json({ message: 'Images reordered', site });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reorder images', details: err.message });
  }
});

// DELETE /api/admin/images/:id
adminRouter.delete('/images/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = await repository.deleteSiteImage(id);
    if (!ok) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete image', details: err.message });
  }
});

// --- PLOT SIZES CRUD ---
// POST /api/admin/sites/:id/plot-sizes
adminRouter.post('/sites/:id/plot-sizes', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { plotSize, area, price, status } = req.body;

    if (!plotSize || !area || !price) {
      res.status(400).json({ error: 'plotSize, area, and price are required' });
      return;
    }

    const created = await repository.addPlotSize(id, { plotSize, area, price, status });
    if (!created) {
      res.status(404).json({ error: 'Site not found' });
      return;
    }
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add plot size', details: err.message });
  }
});

// PUT /api/admin/plot-sizes/:id
adminRouter.put('/plot-sizes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repository.updatePlotSize(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Plot size not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update plot size', details: err.message });
  }
});

// DELETE /api/admin/plot-sizes/:id
adminRouter.delete('/plot-sizes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = await repository.deletePlotSize(id);
    if (!ok) {
      res.status(404).json({ error: 'Plot size not found' });
      return;
    }
    res.json({ message: 'Plot size deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete plot size', details: err.message });
  }
});

// --- LOCATIONS CRUD ---
// GET /api/admin/locations
adminRouter.get('/locations', async (_req: Request, res: Response) => {
  try {
    const locations = await repository.getLocations(false);
    res.json(locations);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch locations', details: err.message });
  }
});

// POST /api/admin/locations
adminRouter.post('/locations', async (req: Request, res: Response) => {
  try {
    const { name, city, state, imageUrl, isActive } = req.body;
    if (!name || !city || !state) {
      res.status(400).json({ error: 'Location name, city, and state are required' });
      return;
    }

    const created = await repository.createLocation({ name, city, state, imageUrl, isActive });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create location', details: err.message });
  }
});

// PUT /api/admin/locations/:id
adminRouter.put('/locations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repository.updateLocation(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update location', details: err.message });
  }
});

// DELETE /api/admin/locations/:id
adminRouter.delete('/locations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = await repository.deleteLocation(id);
    if (!ok) {
      res.status(404).json({ error: 'Location not found' });
      return;
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete location', details: err.message });
  }
});

// --- SETTINGS ---
// GET /api/admin/settings
adminRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await repository.getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
});

// PUT /api/admin/settings
adminRouter.put('/settings', async (req: Request, res: Response) => {
  try {
    const updated = await repository.updateSettings(req.body);
    res.json({ message: 'Settings saved successfully', settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save settings', details: err.message });
  }
});

// --- BLOG POSTS (ADMIN) ---
// GET /api/admin/blogs - List all blog posts (published and drafts)
adminRouter.get('/blogs', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const category = req.query.category as string | undefined;
    const blogs = await repository.getBlogs({
      publishedOnly: false,
      category,
      search,
    });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch admin blogs', details: err.message });
  }
});

// GET /api/admin/blogs/:id - Get blog by ID for editing
adminRouter.get('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await repository.getBlogById(id);
    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch blog', details: err.message });
  }
});

// POST /api/admin/blogs - Create new blog post
adminRouter.post('/blogs', async (req: Request, res: Response) => {
  try {
    const { title, excerpt, content, category } = req.body;
    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Blog title is required' });
      return;
    }
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Blog content is required' });
      return;
    }

    const newBlog = await repository.createBlog(req.body);
    res.status(201).json(newBlog);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create blog post', details: err.message });
  }
});

// PUT /api/admin/blogs/:id - Update blog post
adminRouter.put('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await repository.updateBlog(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update blog post', details: err.message });
  }
});

// DELETE /api/admin/blogs/:id - Delete blog post
adminRouter.delete('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = await repository.deleteBlog(id);
    if (!ok) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete blog post', details: err.message });
  }
});

// PATCH /api/admin/blogs/:id/publish - Toggle publish status
adminRouter.patch('/blogs/:id/publish', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const toggled = await repository.toggleBlogPublish(id);
    if (!toggled) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    res.json(toggled);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to toggle publish status', details: err.message });
  }
});
