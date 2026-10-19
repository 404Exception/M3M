import fs from 'fs';
import path from 'path';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';

async function seed() {
  console.log('🌱 Starting Database Migration and Seeding...');

  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.error('❌ Could not connect to PostgreSQL. Please ensure your DATABASE_URL in .env is correct and PostgreSQL server is running.');
    process.exit(1);
  }

  const dbJsonPath = path.join(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error(`❌ db.json file not found at ${dbJsonPath}`);
    process.exit(1);
  }

  const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

  console.log('🧹 Cleaning existing site and blog data for clean seed...');
  await prisma.plotSize.deleteMany({});
  await prisma.siteImage.deleteMany({});
  await prisma.site.deleteMany({});
  await prisma.blogPost.deleteMany({});

  console.log('📦 Seeding Admin Users...');
  if (Array.isArray(dbData.adminUsers)) {
    for (const user of dbData.adminUsers) {
      await prisma.adminUser.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          isActive: user.isActive !== undefined ? user.isActive : true,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          passwordHash: user.passwordHash,
          isActive: user.isActive !== undefined ? user.isActive : true,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(),
        },
      });
    }
  }

  console.log('📦 Seeding Locations...');
  if (Array.isArray(dbData.locations)) {
    for (const loc of dbData.locations) {
      await prisma.location.upsert({
        where: { id: loc.id },
        update: {
          name: loc.name,
          slug: loc.slug,
          city: loc.city,
          state: loc.state,
          imageUrl: loc.imageUrl || null,
          isActive: loc.isActive !== undefined ? loc.isActive : true,
        },
        create: {
          id: loc.id,
          name: loc.name,
          slug: loc.slug,
          city: loc.city,
          state: loc.state,
          imageUrl: loc.imageUrl || null,
          isActive: loc.isActive !== undefined ? loc.isActive : true,
          createdAt: loc.createdAt ? new Date(loc.createdAt) : new Date(),
          updatedAt: loc.updatedAt ? new Date(loc.updatedAt) : new Date(),
        },
      });
    }
  }

  console.log('📦 Seeding Sites, Images, and Plot Sizes...');
  if (Array.isArray(dbData.sites)) {
    for (const site of dbData.sites) {
      // Upsert site
      await prisma.site.upsert({
        where: { id: site.id },
        update: {
          locationId: site.locationId,
          name: site.name,
          slug: site.slug,
          address: site.address,
          description: site.description,
          googleMapsUrl: site.googleMapsUrl || null,
          latitude: site.latitude || null,
          longitude: site.longitude || null,
          siteType: site.siteType || 'Residential',
          startingPrice: site.startingPrice || null,
          features: site.features || null,
          locationAdvantages: site.locationAdvantages || null,
          videoUrl: site.videoUrl || null,
          status: site.status || 'Available',
          isPublished: site.isPublished !== undefined ? site.isPublished : true,
        },
        create: {
          id: site.id,
          locationId: site.locationId,
          name: site.name,
          slug: site.slug,
          address: site.address,
          description: site.description,
          googleMapsUrl: site.googleMapsUrl || null,
          latitude: site.latitude || null,
          longitude: site.longitude || null,
          siteType: site.siteType || 'Residential',
          startingPrice: site.startingPrice || null,
          features: site.features || null,
          locationAdvantages: site.locationAdvantages || null,
          videoUrl: site.videoUrl || null,
          status: site.status || 'Available',
          isPublished: site.isPublished !== undefined ? site.isPublished : true,
          createdAt: site.createdAt ? new Date(site.createdAt) : new Date(),
          updatedAt: site.updatedAt ? new Date(site.updatedAt) : new Date(),
        },
      });

      // Upsert images
      if (Array.isArray(site.images)) {
        for (const img of site.images) {
          await prisma.siteImage.upsert({
            where: { id: img.id },
            update: {
              siteId: site.id,
              imageUrl: img.imageUrl,
              isCover: img.isCover || false,
              displayOrder: img.displayOrder || 0,
            },
            create: {
              id: img.id,
              siteId: site.id,
              imageUrl: img.imageUrl,
              isCover: img.isCover || false,
              displayOrder: img.displayOrder || 0,
              createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
            },
          });
        }
      }

      // Upsert plot sizes
      if (Array.isArray(site.plotSizes)) {
        for (const ps of site.plotSizes) {
          const plotSizeVal = ps.plotSize || ps.dimensions || ps.size || 'Standard';
          const areaVal = ps.area || ps.size || 'N/A';
          const priceVal = ps.price || 'Price on Request';
          await prisma.plotSize.upsert({
            where: { id: ps.id },
            update: {
              siteId: site.id,
              plotSize: plotSizeVal,
              area: areaVal,
              price: priceVal,
              status: ps.status || 'Available',
            },
            create: {
              id: ps.id,
              siteId: site.id,
              plotSize: plotSizeVal,
              area: areaVal,
              price: priceVal,
              status: ps.status || 'Available',
              createdAt: ps.createdAt ? new Date(ps.createdAt) : new Date(),
              updatedAt: ps.updatedAt ? new Date(ps.updatedAt) : new Date(),
            },
          });
        }
      }
    }
  }

  console.log('📦 Seeding Settings...');
  const settingsToSeed: Record<string, string> = {
    ...(dbData.settings && typeof dbData.settings === 'object' ? dbData.settings : {}),
  };

  if (process.env.DEFAULT_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER) {
    settingsToSeed['whatsapp_number'] = (process.env.DEFAULT_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER)!.trim();
  }
  if (process.env.DEFAULT_PHONE_NUMBER || process.env.PHONE_NUMBER) {
    settingsToSeed['phone_number'] = (process.env.DEFAULT_PHONE_NUMBER || process.env.PHONE_NUMBER)!.trim();
  }

  for (const [key, value] of Object.entries(settingsToSeed)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: {
        id: 'set-' + key,
        key,
        value: String(value),
        updatedAt: new Date(),
      },
    });
  }

  console.log('📦 Seeding Blog Posts...');
  if (Array.isArray(dbData.blogs)) {
    for (const blog of dbData.blogs) {
      await prisma.blogPost.upsert({
        where: { id: blog.id },
        update: {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage || null,
          author: blog.author || 'M3M Luxury Investment Advisory',
          category: blog.category || 'Investment & Insights',
          readTime: blog.readTime || '4 min read',
          tags: Array.isArray(blog.tags) ? JSON.stringify(blog.tags) : (blog.tags || null),
          isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
          publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
        },
        create: {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage || null,
          author: blog.author || 'M3M Luxury Investment Advisory',
          category: blog.category || 'Investment & Insights',
          readTime: blog.readTime || '4 min read',
          tags: Array.isArray(blog.tags) ? JSON.stringify(blog.tags) : (blog.tags || null),
          isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
          publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
          createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
          updatedAt: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
        },
      });
    }
  }

  console.log('✅ Database successfully populated with all records!');
  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error('❌ Seeding failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
