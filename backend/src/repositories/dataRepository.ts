import bcrypt from 'bcryptjs';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { AdminUser, Location, Site, SiteImage, PlotSize, BlogPost } from '../types.js';

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function formatLocation(loc: any): Location {
  return {
    id: loc.id,
    name: loc.name,
    slug: loc.slug,
    city: loc.city,
    state: loc.state,
    imageUrl: loc.imageUrl || undefined,
    isActive: loc.isActive,
    createdAt: loc.createdAt instanceof Date ? loc.createdAt.toISOString() : loc.createdAt,
    updatedAt: loc.updatedAt instanceof Date ? loc.updatedAt.toISOString() : loc.updatedAt,
    siteCount: Array.isArray(loc.sites) ? loc.sites.length : (loc._count?.sites ?? 0),
  };
}

function formatSite(site: any): Site {
  return {
    id: site.id,
    locationId: site.locationId,
    name: site.name,
    slug: site.slug,
    address: site.address,
    description: site.description,
    googleMapsUrl: site.googleMapsUrl || undefined,
    latitude: site.latitude ?? undefined,
    longitude: site.longitude ?? undefined,
    siteType: site.siteType,
    startingPrice: site.startingPrice || undefined,
    features: site.features || undefined,
    locationAdvantages: site.locationAdvantages || undefined,
    videoUrl: site.videoUrl || undefined,
    status: site.status,
    isPublished: site.isPublished,
    createdAt: site.createdAt instanceof Date ? site.createdAt.toISOString() : site.createdAt,
    updatedAt: site.updatedAt instanceof Date ? site.updatedAt.toISOString() : site.updatedAt,
    location: site.location ? formatLocation(site.location) : undefined,
    images: Array.isArray(site.images)
      ? site.images.map((img: any) => ({
          id: img.id,
          siteId: img.siteId,
          imageUrl: img.imageUrl,
          isCover: img.isCover,
          displayOrder: img.displayOrder,
          createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
        }))
      : [],
    plotSizes: Array.isArray(site.plotSizes)
      ? site.plotSizes.map((ps: any) => ({
          id: ps.id,
          siteId: ps.siteId,
          plotSize: ps.plotSize,
          area: ps.area,
          price: ps.price,
          status: ps.status,
          createdAt: ps.createdAt instanceof Date ? ps.createdAt.toISOString() : ps.createdAt,
          updatedAt: ps.updatedAt instanceof Date ? ps.updatedAt.toISOString() : ps.updatedAt,
        }))
      : [],
  };
}

function formatBlog(blog: any): BlogPost {
  let parsedTags: string[] = [];
  if (blog.tags) {
    try {
      parsedTags = JSON.parse(blog.tags);
    } catch {
      parsedTags = blog.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
  }

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage || undefined,
    author: blog.author,
    category: blog.category,
    readTime: blog.readTime,
    tags: parsedTags,
    isPublished: blog.isPublished,
    publishedAt: blog.publishedAt ? (blog.publishedAt instanceof Date ? blog.publishedAt.toISOString() : blog.publishedAt) : undefined,
    createdAt: blog.createdAt instanceof Date ? blog.createdAt.toISOString() : blog.createdAt,
    updatedAt: blog.updatedAt instanceof Date ? blog.updatedAt.toISOString() : blog.updatedAt,
  };
}

export class DataRepository {
  private isConnected = false;

  async initDatabase(): Promise<void> {
    this.isConnected = await checkDatabaseConnection();
    if (!this.isConnected) {
      console.warn('⚠️  Database is not reachable. Ensure DATABASE_URL is set and PostgreSQL is running.');
      return;
    }
    console.log('✅ PostgreSQL database connected successfully via Prisma.');

    // Ensure default admin user and default settings exist if tables are empty
    try {
      const adminCount = await prisma.adminUser.count();
      if (adminCount === 0) {
        console.log('👤 Creating initial default admin account in PostgreSQL...');
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync('AdminPassword@123', salt);
        await prisma.adminUser.create({
          data: {
            id: 'admin-1',
            name: 'M3M Executive Administrator',
            email: 'admin@m3mproperties.com',
            passwordHash,
            isActive: true,
          },
        });
      }

      const settingsCount = await prisma.setting.count();
      if (settingsCount === 0) {
        console.log('⚙️  Creating default settings in PostgreSQL...');
        const defaults: Record<string, string> = {
          company_name: 'M3M Properties',
          whatsapp_number: process.env.DEFAULT_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '919876543210',
          phone_number: process.env.DEFAULT_PHONE_NUMBER || process.env.PHONE_NUMBER || '+91 98765 43210',
          company_address: 'M3M Experion Center, Golf Course Extension Road, Sector 65, Gurugram, Haryana - 122018',
          email: 'concierge@m3mproperties.com',
          logo_url: '/logo/m3m-logo.png',
          business_hours: 'Mon - Sun: 9:00 AM - 8:00 PM',
          hero_headline: 'Magnificence in Men, Materials & Money – M3M Inventory',
          hero_subheadline: 'Discover iconic luxury residences, high-street retail promenades, Grade-A corporate towers & ultra-luxury serviced suites across Gurugram & NCR.',
        };
        for (const [key, value] of Object.entries(defaults)) {
          await prisma.setting.create({
            data: {
              id: 'set-' + key,
              key,
              value,
            },
          });
        }
      }
    } catch (err: any) {
      console.warn('⚠️  Database initialization check encountered an error:', err.message);
    }
  }

  get isPostgresConnected(): boolean {
    return this.isConnected;
  }

  // --- ADMIN AUTH ---
  async findAdminByEmail(email: string): Promise<AdminUser | null> {
    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async findAdminById(id: string): Promise<AdminUser | null> {
    const user = await prisma.adminUser.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async updateAdminPassword(id: string, newPasswordHash: string): Promise<boolean> {
    try {
      await prisma.adminUser.update({
        where: { id },
        data: { passwordHash: newPasswordHash },
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- LOCATIONS ---
  async getLocations(onlyActive = true): Promise<Location[]> {
    const locations = await prisma.location.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      include: {
        sites: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    return locations.map(formatLocation);
  }

  async getLocationById(id: string): Promise<Location | null> {
    const loc = await prisma.location.findUnique({
      where: { id },
      include: {
        sites: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });
    return loc ? formatLocation(loc) : null;
  }

  async getLocationBySlug(slug: string): Promise<Location | null> {
    const loc = await prisma.location.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        sites: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });
    return loc ? formatLocation(loc) : null;
  }

  async createLocation(data: { name: string; city: string; state: string; imageUrl?: string; isActive?: boolean }): Promise<Location> {
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.location.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const created = await prisma.location.create({
      data: {
        name: data.name.trim(),
        slug,
        city: data.city.trim(),
        state: data.state.trim(),
        imageUrl: data.imageUrl || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        sites: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });
    return formatLocation(created);
  }

  async updateLocation(id: string, data: Partial<Location>): Promise<Location | null> {
    const existing = await prisma.location.findUnique({ where: { id } });
    if (!existing) return null;

    let slug = existing.slug;
    if (data.name && data.name.trim() !== existing.name) {
      const baseSlug = slugify(data.name);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.location.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const updated = await prisma.location.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name.trim(), slug } : {}),
        ...(data.city !== undefined ? { city: data.city.trim() } : {}),
        ...(data.state !== undefined ? { state: data.state.trim() } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || null } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
      include: {
        sites: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });
    return formatLocation(updated);
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      await prisma.location.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // --- SITES ---
  async getSites(options?: {
    locationId?: string;
    locationSlug?: string;
    siteType?: string;
    status?: string;
    publishedOnly?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Site[]> {
    const where: any = {};

    if (options?.locationId) {
      where.locationId = options.locationId;
    }
    if (options?.locationSlug) {
      where.location = { slug: options.locationSlug.toLowerCase() };
    }
    if (options?.siteType && options.siteType !== 'All') {
      where.siteType = { equals: options.siteType, mode: 'insensitive' };
    }
    if (options?.publishedOnly) {
      where.isPublished = true;
    }
    if (options?.status && options.status !== 'All') {
      where.status = options.status;
    }
    if (options?.search) {
      const q = options.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { features: { contains: q, mode: 'insensitive' } },
      ];
    }

    const sites = await prisma.site.findMany({
      where,
      include: {
        location: true,
        images: { orderBy: { displayOrder: 'asc' } },
        plotSizes: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });

    return sites.map(formatSite);
  }

  async getSiteById(id: string): Promise<Site | null> {
    const site = await prisma.site.findUnique({
      where: { id },
      include: {
        location: true,
        images: { orderBy: { displayOrder: 'asc' } },
        plotSizes: { orderBy: { createdAt: 'asc' } },
      },
    });
    return site ? formatSite(site) : null;
  }

  async getSiteBySlug(slug: string, publishedOnly = false): Promise<Site | null> {
    const site = await prisma.site.findFirst({
      where: {
        slug: slug.toLowerCase(),
        ...(publishedOnly ? { isPublished: true } : {}),
      },
      include: {
        location: true,
        images: { orderBy: { displayOrder: 'asc' } },
        plotSizes: { orderBy: { createdAt: 'asc' } },
      },
    });
    return site ? formatSite(site) : null;
  }

  async createSite(data: {
    locationId: string;
    name: string;
    address: string;
    description: string;
    googleMapsUrl?: string;
    latitude?: number;
    longitude?: number;
    siteType?: string;
    startingPrice?: string;
    features?: string;
    locationAdvantages?: string;
    videoUrl?: string;
    status?: 'Available' | 'Sold' | 'Unavailable';
    isPublished?: boolean;
    images?: Array<{ imageUrl: string; isCover?: boolean; displayOrder?: number }>;
    plotSizes?: Array<{ plotSize: string; area: string; price: string; status?: 'Available' | 'Sold' }>;
  }): Promise<Site> {
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.site.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const created = await prisma.site.create({
      data: {
        locationId: data.locationId,
        name: data.name.trim(),
        slug,
        address: data.address.trim(),
        description: data.description.trim(),
        googleMapsUrl: data.googleMapsUrl?.trim() || null,
        latitude: data.latitude === null || data.latitude === ('' as any) || (data.latitude !== undefined && isNaN(Number(data.latitude))) ? null : (data.latitude !== undefined ? Number(data.latitude) : undefined),
        longitude: data.longitude === null || data.longitude === ('' as any) || (data.longitude !== undefined && isNaN(Number(data.longitude))) ? null : (data.longitude !== undefined ? Number(data.longitude) : undefined),
        siteType: data.siteType?.trim() || 'Residential',
        startingPrice: data.startingPrice?.trim() || null,
        features: data.features?.trim() || null,
        locationAdvantages: data.locationAdvantages?.trim() || null,
        videoUrl: data.videoUrl?.trim() || null,
        status: data.status || 'Available',
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        images: Array.isArray(data.images) && data.images.length > 0
          ? {
              create: data.images.map((img, idx) => ({
                imageUrl: img.imageUrl,
                isCover: img.isCover || (idx === 0),
                displayOrder: img.displayOrder ?? idx,
              })),
            }
          : undefined,
        plotSizes: Array.isArray(data.plotSizes) && data.plotSizes.length > 0
          ? {
              create: data.plotSizes.map(ps => ({
                plotSize: ps.plotSize.trim(),
                area: ps.area.trim(),
                price: ps.price.trim(),
                status: ps.status || 'Available',
              })),
            }
          : undefined,
      },
      include: {
        location: true,
        images: { orderBy: { displayOrder: 'asc' } },
        plotSizes: { orderBy: { createdAt: 'asc' } },
      },
    });

    return formatSite(created);
  }

  async updateSite(id: string, data: Partial<Site>): Promise<Site | null> {
    const existing = await prisma.site.findUnique({ where: { id } });
    if (!existing) return null;

    let slug = existing.slug;
    if (data.name && data.name.trim() !== existing.name) {
      const baseSlug = slugify(data.name);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.site.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const updated = await prisma.$transaction(async (tx: any) => {
      await tx.site.update({
        where: { id },
        data: {
          ...(data.locationId !== undefined ? { locationId: data.locationId } : {}),
          ...(data.name !== undefined ? { name: data.name.trim(), slug } : {}),
          ...(data.address !== undefined ? { address: data.address.trim() } : {}),
          ...(data.description !== undefined ? { description: data.description.trim() } : {}),
          ...(data.googleMapsUrl !== undefined ? { googleMapsUrl: data.googleMapsUrl?.trim() || null } : {}),
          ...(data.latitude !== undefined
            ? { latitude: data.latitude === null || data.latitude === ('' as any) || isNaN(Number(data.latitude)) ? null : Number(data.latitude) }
            : {}),
          ...(data.longitude !== undefined
            ? { longitude: data.longitude === null || data.longitude === ('' as any) || isNaN(Number(data.longitude)) ? null : Number(data.longitude) }
            : {}),
          ...(data.siteType !== undefined ? { siteType: data.siteType.trim() } : {}),
          ...(data.startingPrice !== undefined ? { startingPrice: data.startingPrice?.trim() || null } : {}),
          ...(data.features !== undefined ? { features: data.features?.trim() || null } : {}),
          ...(data.locationAdvantages !== undefined ? { locationAdvantages: data.locationAdvantages?.trim() || null } : {}),
          ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl?.trim() || null } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.isPublished !== undefined ? { isPublished: Boolean(data.isPublished) } : {}),
        },
      });

      if (Array.isArray(data.images)) {
        await tx.siteImage.deleteMany({ where: { siteId: id } });
        if (data.images.length > 0) {
          await tx.siteImage.createMany({
            data: data.images.map((img: any, idx: number) => ({
              siteId: id,
              imageUrl: img.imageUrl,
              isCover: img.isCover !== undefined ? Boolean(img.isCover) : idx === 0,
              displayOrder: img.displayOrder !== undefined ? Number(img.displayOrder) : idx,
            })),
          });
        }
      }

      if (Array.isArray(data.plotSizes)) {
        await tx.plotSize.deleteMany({ where: { siteId: id } });
        if (data.plotSizes.length > 0) {
          await tx.plotSize.createMany({
            data: data.plotSizes
              .filter((ps: any) => ps.plotSize && ps.plotSize.trim())
              .map((ps: any) => ({
                siteId: id,
                plotSize: ps.plotSize.trim(),
                area: (ps.area || '').trim(),
                price: (ps.price || '').trim(),
                status: ps.status || 'Available',
              })),
          });
        }
      }

      return tx.site.findUnique({
        where: { id },
        include: {
          location: true,
          images: { orderBy: { displayOrder: 'asc' } },
          plotSizes: { orderBy: { createdAt: 'asc' } },
        },
      });
    });

    return updated ? formatSite(updated) : null;
  }

  async deleteSite(id: string): Promise<boolean> {
    try {
      await prisma.site.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  // --- SITE IMAGES ---
  async addSiteImage(siteId: string, imageUrl: string, isCover = false): Promise<SiteImage | null> {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: { images: true },
    });
    if (!site) return null;

    const shouldBeCover = isCover || site.images.length === 0;
    if (shouldBeCover) {
      await prisma.siteImage.updateMany({
        where: { siteId },
        data: { isCover: false },
      });
    }

    const created = await prisma.siteImage.create({
      data: {
        siteId,
        imageUrl,
        isCover: shouldBeCover,
        displayOrder: site.images.length,
      },
    });

    return {
      id: created.id,
      siteId: created.siteId,
      imageUrl: created.imageUrl,
      isCover: created.isCover,
      displayOrder: created.displayOrder,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async deleteSiteImage(imageId: string): Promise<boolean> {
    try {
      const img = await prisma.siteImage.findUnique({ where: { id: imageId } });
      if (!img) return false;

      await prisma.siteImage.delete({ where: { id: imageId } });

      // If removed image was cover, set the next remaining image as cover
      if (img.isCover) {
        const remaining = await prisma.siteImage.findFirst({
          where: { siteId: img.siteId },
          orderBy: { displayOrder: 'asc' },
        });
        if (remaining) {
          await prisma.siteImage.update({
            where: { id: remaining.id },
            data: { isCover: true },
          });
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  async setCoverImage(siteId: string, imageId: string): Promise<boolean> {
    try {
      await prisma.siteImage.updateMany({
        where: { siteId },
        data: { isCover: false },
      });
      await prisma.siteImage.update({
        where: { id: imageId },
        data: { isCover: true },
      });
      return true;
    } catch {
      return false;
    }
  }

  async reorderImages(siteId: string, imageIds: string[]): Promise<boolean> {
    try {
      for (let i = 0; i < imageIds.length; i++) {
        await prisma.siteImage.update({
          where: { id: imageIds[i] },
          data: { displayOrder: i },
        });
      }
      return true;
    } catch {
      return false;
    }
  }

  // --- PLOT SIZES ---
  async addPlotSize(siteId: string, data: { plotSize: string; area: string; price: string; status?: 'Available' | 'Sold' }): Promise<PlotSize | null> {
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) return null;

    const created = await prisma.plotSize.create({
      data: {
        siteId,
        plotSize: data.plotSize.trim(),
        area: data.area.trim(),
        price: data.price.trim(),
        status: data.status || 'Available',
      },
    });

    return {
      id: created.id,
      siteId: created.siteId,
      plotSize: created.plotSize,
      area: created.area,
      price: created.price,
      status: created.status as any,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async updatePlotSize(plotSizeId: string, data: Partial<PlotSize>): Promise<PlotSize | null> {
    try {
      const updated = await prisma.plotSize.update({
        where: { id: plotSizeId },
        data: {
          ...(data.plotSize !== undefined ? { plotSize: data.plotSize.trim() } : {}),
          ...(data.area !== undefined ? { area: data.area.trim() } : {}),
          ...(data.price !== undefined ? { price: data.price.trim() } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
        },
      });

      return {
        id: updated.id,
        siteId: updated.siteId,
        plotSize: updated.plotSize,
        area: updated.area,
        price: updated.price,
        status: updated.status as any,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    } catch {
      return null;
    }
  }

  async deletePlotSize(plotSizeId: string): Promise<boolean> {
    try {
      await prisma.plotSize.delete({ where: { id: plotSizeId } });
      return true;
    } catch {
      return false;
    }
  }

  // --- SETTINGS ---
  async getSettings(): Promise<Record<string, string>> {
    const envWhatsapp = process.env.VITE_CONTACT_WHATSAPP || process.env.DEFAULT_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || '';
    const envPhone = process.env.VITE_CONTACT_PHONE || process.env.DEFAULT_PHONE_NUMBER || process.env.PHONE_NUMBER || '';
    const envEmail = process.env.VITE_CONTACT_EMAIL || process.env.EMAIL || '';
    const envAddress = process.env.VITE_OFFICE_ADDRESS || process.env.COMPANY_ADDRESS || '';

    const defaultMap: Record<string, string> = {
      company_name: 'M3M Properties',
      whatsapp_number: envWhatsapp.trim() || '919876543210',
      phone_number: envPhone.trim() || '+91 98765 43210',
      email: envEmail.trim() || 'concierge@m3mproperties.com',
      company_address: envAddress.trim() || 'M3M Experion Center, Golf Course Extension Road, Sector 65, Gurugram, Haryana - 122018',
      business_hours: 'Mon - Sun: 9:00 AM - 8:00 PM',
      logo_url: '/logo/m3m-logo.png',
    };

    const settingsList = await prisma.setting.findMany();
    const dbMap: Record<string, string> = {};
    settingsList.forEach((s: any) => {
      if (s.value !== undefined && s.value !== null && s.value !== '') {
        dbMap[s.key] = s.value;
      }
    });

    return {
      ...defaultMap,
      ...dbMap,
    };
  }

  async updateSettings(settingsUpdate: Record<string, string>): Promise<Record<string, string>> {
    for (const [key, value] of Object.entries(settingsUpdate)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value ?? '') },
        create: {
          id: 'set-' + key,
          key,
          value: String(value ?? ''),
        },
      });
    }
    return this.getSettings();
  }

  // --- BLOG POSTS ---
  async getBlogs(options?: {
    publishedOnly?: boolean;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]> {
    const where: any = {};

    if (options?.publishedOnly) {
      where.isPublished = true;
    }
    if (options?.category && options.category !== 'All') {
      where.category = { equals: options.category, mode: 'insensitive' };
    }
    if (options?.search) {
      const q = options.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { tags: { contains: q, mode: 'insensitive' } },
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });

    return blogs.map(formatBlog);
  }

  async getBlogById(id: string): Promise<BlogPost | null> {
    const blog = await prisma.blogPost.findUnique({ where: { id } });
    return blog ? formatBlog(blog) : null;
  }

  async getBlogBySlug(slug: string, publishedOnly = false): Promise<BlogPost | null> {
    const blog = await prisma.blogPost.findFirst({
      where: {
        slug: slug.toLowerCase(),
        ...(publishedOnly ? { isPublished: true } : {}),
      },
    });
    return blog ? formatBlog(blog) : null;
  }

  async createBlog(data: Partial<BlogPost>): Promise<BlogPost> {
    const baseSlug = slugify(data.title || 'untitled-article');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const now = new Date();
    const created = await prisma.blogPost.create({
      data: {
        title: (data.title || 'Untitled Article').trim(),
        slug,
        excerpt: (data.excerpt || '').trim(),
        content: (data.content || '').trim(),
        coverImage: (data.coverImage || '').trim() || null,
        author: (data.author || 'DDJAY Advisory Desk').trim(),
        category: (data.category || 'Policy & Guidelines').trim(),
        readTime: (data.readTime || '4 min read').trim(),
        tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : (data.tags || null),
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        publishedAt: data.isPublished ? now : null,
      },
    });

    return formatBlog(created);
  }

  async updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return null;

    let slug = existing.slug;
    if (data.slug && data.slug.trim() !== existing.slug) {
      const baseSlug = slugify(data.slug);
      slug = baseSlug;
      let counter = 1;
      while (await prisma.blogPost.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.slug !== undefined ? { slug } : {}),
        ...(data.excerpt !== undefined ? { excerpt: data.excerpt.trim() } : {}),
        ...(data.content !== undefined ? { content: data.content.trim() } : {}),
        ...(data.coverImage !== undefined ? { coverImage: data.coverImage.trim() || null } : {}),
        ...(data.author !== undefined ? { author: data.author.trim() } : {}),
        ...(data.category !== undefined ? { category: data.category.trim() } : {}),
        ...(data.readTime !== undefined ? { readTime: data.readTime.trim() } : {}),
        ...(data.tags !== undefined ? { tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : (data.tags || null) } : {}),
        ...(data.isPublished !== undefined ? {
          isPublished: data.isPublished,
          publishedAt: data.isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
        } : {}),
      },
    });

    return formatBlog(updated);
  }

  async deleteBlog(id: string): Promise<boolean> {
    try {
      await prisma.blogPost.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async toggleBlogPublish(id: string): Promise<BlogPost | null> {
    const blog = await prisma.blogPost.findUnique({ where: { id } });
    if (!blog) return null;

    const newPublished = !blog.isPublished;
    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        isPublished: newPublished,
        publishedAt: newPublished && !blog.publishedAt ? new Date() : blog.publishedAt,
      },
    });

    return formatBlog(updated);
  }

  // --- DASHBOARD STATS ---
  async getDashboardStats() {
    const [
      totalSites,
      publishedSites,
      availableSites,
      soldSites,
      totalLocations,
      totalBlogs,
      publishedBlogs,
    ] = await Promise.all([
      prisma.site.count(),
      prisma.site.count({ where: { isPublished: true } }),
      prisma.site.count({ where: { status: 'Available' } }),
      prisma.site.count({ where: { status: 'Sold' } }),
      prisma.location.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
    ]);

    return {
      totalSites,
      publishedSites,
      unpublishedSites: totalSites - publishedSites,
      availableSites,
      soldSites,
      totalLocations,
      totalBlogs,
      publishedBlogs,
    };
  }

  // --- PUBLIC STATS ---
  async getPublicStats(): Promise<{ activeLocations: number; verifiedSites: number }> {
    const [activeLocations, verifiedSites] = await Promise.all([
      prisma.location.count({ where: { isActive: true } }),
      prisma.site.count({ where: { isPublished: true } }),
    ]);

    return {
      activeLocations,
      verifiedSites,
    };
  }
}

export const repository = new DataRepository();
